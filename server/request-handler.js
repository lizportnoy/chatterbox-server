/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var url = require("url");
var fs = require("fs");
var path = require("path");

var results = [{
  username: 'anonymous',
  roomname: 'lobby',
  objectId: 0,
  text: 'herro'
}];

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

var postMessage = function (request, response) {
  var requestBody = "";
  request.on('data', function (data) {
    requestBody += data;
  });

  request.on('end', function () {
    response.writeHead(201, headers);
    var newMessage = JSON.parse(requestBody);
    newMessage.objectId = messageIdCounter;
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

var getFile = function(localPath, response, mimeType) {
  fs.readFile(localPath, function(err, contents) {
    if(!err) {
      headers['Content-Type'] = mimeType;
      response.writeHead(200, headers);
      response.end(contents);
    } else {
      response.writeHead(500);
      response.end();
    }
  });
}

var getIndex = function(request, response) {
  // Get file extensions and validate
  var filename = request.url || "index.html";
  var ext = path.extname(filename);
  var localPath = '/Users/HR10/Desktop/2014-10-chatterbox-server/client/';
  var validExtensions = {
    ".html" : "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".txt": "text/plain",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".png": "image/png"
  };
  var isValidExt = validExtensions[ext];

  if (isValidExt) {

    localPath += filename;
    fs.exists(localPath, function(exists) {
      if(exists) {
        console.log("Serving file: " + localPath);
        getFile(localPath, response, ext);
      } else {
        console.log("File not found: " + localPath);
        response.writeHead(404);
        response.end();
      }
    });

  } else {
    console.log("Invalid file extension detected: " + ext)
  }
}

// createServer callback
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
  } else if ('/' === uri) {
    getIndex(request,response);
  } else {
    notFound(response);
  }



};
