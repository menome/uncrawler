/**
 * Copyright (c) 2017 Menome Technologies Inc.
 * Configuration for the bot
 */
"use strict";
module.exports = {
  crawler: {
    findRegex: {
      doc: "Only find files whose path matches this regex. Grep-type regex. (Gets piped into the UNIX find command. Must be double-escaped.)",
      format: "*",
      default: ".pdf$|.docx$|.doc$|.pptx$|.txt$"
    },
    regexWhitelist: {
      doc: "Array of regexes. File is accepted if its full path matches any of these.",
      default: [],
      format: function check(regexes) {
        regexes.forEach((regex) => {
          if((typeof regex !== 'string'))
            throw new Error('Regexes must be a string.');

          // This will throw errors if it can't be a regex.
          new RegExp(regex)
        })
      }
    },
    regexFilenameWhitelist: {
      doc: "Array of regexes. File is accepted if its name matches any of these.",
      default: [],
      format: function check(regexes) {
        regexes.forEach((regex) => {
          if((typeof regex !== 'string'))
            throw new Error('Regexes must be a string.');

          // This will throw errors if it can't be a regex.
          new RegExp(regex)
        })
      }
    },
    librarykey: {
      doc: "The library key that will be used for this DAV crawl.",
      format: "String",
      env: "CRAWLER_LIBRARY_KEY",
      default: "dav"
    },
    host: {
      doc: "The URL of the DAV share to crawl.",
      format: "String",
      env: "DAV_HOST",
      default: "http://localhost:80"
    },
    username: {
      doc: "The username of the DAV account",
      format: "String",
      env: "DAV_USER",
      default: "user"
    },
    password: {
      doc: "The Password of the DAV account.",
      format: "String",
      sensitive: true,
      env: "DAV_PASS",
      default: "pass"
    }
  }
}