/**
 * Copyright (C) 2017 Menome Technologies.
 *
 * Crawls a file tree, copies it, and turns it into graph nodes.
 */
const createClient = require('webdav');
const async = require('async');
const rp = require('request-promise')

const fileQuery = "MATCH (f:File) WHERE EXISTS(f.LibraryKey) AND EXISTS(f.LibraryPath) RETURN f.Uuid as uuid, f.LibraryKey as key, f.LibraryPath as path";
const delQuery = "MATCH (f:File {Uuid: $uuid}) DETACH DELETE f";

module.exports = function crawler(bot) {
  this.uncrawl = function() {


    var workQueue = async.queue((task,callback) => {
      task().then((resp)=>{
        console.log(resp);
        callback();
      })
    })
  
    // Called when our work queue is empty.
    // If our work queue is empty AND our crawling command has finished, then we're done here.
    workQueue.drain = () => {
      console.log("Work Queue Empty.")
      // if(findFinished === true) {
      //   bot.logger.info("Finished crawling",localCrawlDir);
      //   return cb();
      // }
    }
    // var deletedFiles = [];

    return bot.neo4j.query(fileQuery).then((result) => {
      result.records.forEach((rec) => {
        workQueue.push(() => {
          return bot.librarian.stat(rec.get('key'),rec.get('path')).catch((err) => {
            if(err.statusCode === 404) {
              bot.logger.info("File does not exist", rec.get('path'));

              return bot.neo4j.query(delQuery, {uuid: rec.get('uuid')}).then((result) => {
                bot.logger.info("Deleted file ", rec.get('uuid'))
              })
            }
            else 
              bot.logger.info("Could not get file.")
          })
        })
      })
    }).catch((err) => {
      bot.logger.error("Could not fetch files:", err.toString());
    });
  }
}