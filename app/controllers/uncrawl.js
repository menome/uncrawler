var helpers = require('@menome/botframework/helpers');

module.exports.swaggerDef = {
  "/uncrawl": {
    "x-swagger-router-controller": "uncrawl",
    "post": {
      "description": "Remove unused files.",
      "summary": "Delete files in the graph if they no longer exist at the source.",
      "tags": [
        "Uncrawl"
      ],
      "responses": {
        "200": {
          "description": "Success"
        },
        "default": {
          "description": "Error"
        }
      }
    }
  }
}

module.exports.post = function(req,res) {
  res.send(helpers.responseWrapper({message: "Starting Uncrawl"}))

  return req.uncrawler.uncrawl().then((result) => {
    req.bot.logger.info("Finished uncrawling.", result)
  }).catch((err) => {
    req.bot.logger.error("Failed to uncrawl: ", err);
  });
}