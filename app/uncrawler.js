/**
 * Copyright (C) 2017 Menome Technologies.
 *
 * Crawls a file tree, copies it, and turns it into graph nodes.
 */
const async = require('async');

const fileQuery = "MATCH (f:File) WHERE EXISTS(f.LibraryKey) AND EXISTS(f.LibraryPath) RETURN f.Uuid as uuid, f.LibraryKey as key, f.LibraryPath as path";
const delQuery = "MATCH (f:File {Uuid: $uuid}) DETACH DELETE f";

module.exports = function uncrawler(bot) {
  // Keep one single workqueue for the uncrawler instance.
  var workQueue = async.queue((task,callback) => {
    task().then((resp)=>{
      bot.logger.info(resp);
      callback();
    }).catch((err) => {
      bot.logger.error(err.toString())
      callback();
    })
  })

  // Called when our work queue is empty.
  // Probably not necessary. We maintain one work queue. 
  // When it drains we don't move on to other logic. We just wait for more things.
  workQueue.drain = () => {
    console.log("Work Queue Empty.")
  }

  this.uncrawl = function() {
    var sesh = bot.neo4j.session();

    return new Promise((resolve,reject) => {
      sesh.run(fileQuery).subscribe({
        onNext: function(rec) {
          workQueue.push(() => {
            return bot.librarian.stat(rec.get('key'),rec.get('path')).then(() => {
              return "Keeping file " + rec.get('uuid')
            }).catch((err) => {
              if(err.statusCode === 404) {
                return bot.neo4j.query(delQuery, {uuid: rec.get('uuid')}).then(() => {
                  return "Deleted File " + rec.get('uuid');
                })
              }
              else {
                throw new Error("Could not get file: " + rec.get('uuid'))
              }
            })
          })
        },
        onError: function(err) {
          bot.logger.error("Could not fetch files:", err.toString());
          sesh.close();
          reject(err);
        },
        onCompleted: function() {
          sesh.close();
          resolve("All checkable file UUIDs retrieved.")
        }
      })
    });
  }
}