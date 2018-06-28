# UNCRAWLER

It's like a crawler but backwards!

Running the uncrawler will remove all files from the graph that are no longer present in their source systems.

Edit `config.json` or configure with environment variables to set up.

How it works:
 1) Query the graph for Library-enabled files.
 2) For each file, attempt to retrieve it from the Librarian
 3) Every file that results in a 404 gets removed from the graph.

## Usage

Run `npm start` to run the application as a web microservice. Sending a POST request to `/uncrawl` will cause the application to run its uncrawling process.
