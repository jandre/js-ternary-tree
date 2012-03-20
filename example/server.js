var http = require('http');
var url = require('url');
var sys = require('util');
var fs = require('fs');
var path = require('path');
var ternarytree = require('../ternary-tree.js');


var data = [];

var tree = new ternarytree.TernaryTree();

function respondToSearch(urlparts, req, res) {

    params = urlparts.query;
    query = params.query;
    count = params.count;

    console.log("got query=" + query + " count="  + count);

    var matches = tree.search(query, count);

    if (matches.length > count) {
        /* TODO: short circuit the search instead. */
        matches = matches.splice(0, count);
    }
    
    var result = {
        'success': 1, 
        'matches': matches,
        'count': matches.length
    };

    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end(JSON.stringify(result));
}

function serveFile(path, type, req, res) {
    /* lol not secure. never use this in production */
    res.writeHead(200, {'Content-Type': type })
    var stream = fs.createReadStream(path);
    stream.pipe(res);
} 


function fourohfour(req, res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 Not Found\n');
    res.end();
}

function setupExampleDatabase(runServer) {
   /* read all strings from example */
   
   fs.readFile('data/biglist.txt', function(err, data) {
        if (err)
            throw err;
        if (data) {
            var str = data.toString();
            var strings = str.split('\n');
            for (id in strings) {
                tree.add(strings[id]);
            }
            console.log("added " + strings.length + " strings to search tree.");
            runServer();
        }
   });
}


var doServer = function() {

    setupExampleDatabase(function() {
        
         http.createServer(handleRequests).listen(8080, "127.0.0.1");
         console.log('Server running at http://127.0.0.1:8080');

    });

}

var handleRequests = function(req,res) {
    /* only one route -> /search */
    var urlparts = url.parse(req.url, true);
    console.log("Request for: " + urlparts.pathname);
    switch (urlparts.pathname) {
        case '/search':
            respondToSearch(urlparts, req, res);
            break;
        case '/client.js':
            serveFile('client.js', 'text/javascript', req, res);
            break;
        case '/ternary-tree.js':
            serveFile('../ternary-tree.js','text/javascript', req, res);
            break;
        case '/style.css':
            serveFile('static/style.css', 'text/css', req, res);
            break;
        case '/':
            serveFile('static/index.html', 'text/html', req, res);
            break;
        default:
            fourohfour(req,res);

    }
};


doServer();




