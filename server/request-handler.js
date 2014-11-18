/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var url = require("url");
var results = [{username: 'anonymous', roomname: 'lobby'}];
var messageIdCounter = 0;

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-credentials": "true",
  "access-control-allow-headers": "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept",
  "access-control-max-age": 10 // Seconds.
};


var headers = defaultCorsHeaders;
headers['Content-Type'] = "application/json";

exports.requestHandler = function(request, response) {

  var uri = url.parse(request.url).path.substring(0,9);

  // Messages
  if ('/classes/' === uri) {
    switch (request.method) {
      case 'GET':
        getMessage(request, response);
        break;

      case 'POST':
        postMessage(request, response);
        break;

      default:
        badRequest(response);
    }
  } else {
    notFound(response);
  }
};

var postMessage = function (request, response) {
  var requestBody = "";
  request.on('data', function (data) {
    requestBody += data;
  });

  request.on('end', function () {
    response.writeHead(201, headers);
    var newMessage = JSON.parse(requestBody);
    newMessage.messageId = messageIdCounter;
    messageIdCounter++;
    newMessage.createdAt = Date.now();
    results.push(newMessage);
    response.end(JSON.stringify({'results': results}));
  });
};

var getMessage = function (request, response) {
  response.writeHead(200, headers);
  response.end(JSON.stringify({'results': results}));
};

var badRequest = function (response) {
  response.writeHead(404, headers);
  response.end('Default in Switch Statement');
};

var notFound = function(response) {
  response.writeHead(404, headers);
  response.end('Not Found');
};


