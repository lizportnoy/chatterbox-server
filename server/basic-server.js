/* Import node's http module: */
var http = require("http");
var handleRequest = require('./request-handler');
var path = require('path'); // path will let you set local paths to different templates
var fs = require('fs');

var port = 3000;

var ip = "127.0.0.1";




var server = http.createServer(handleRequest.requestHandler);
console.log("Listening on http://" + ip + ":" + port);
// Start server
server.listen(port, ip);



