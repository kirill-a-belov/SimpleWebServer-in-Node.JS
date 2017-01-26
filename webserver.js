var serverHost = '127.0.0.1';
var serverPort = 80;
var http = require('http');
var url = require('url');
var file = require('fs');
var queryStr = require('querystring');

function requestHandler(request, response) {
    var path = url.parse(request.url).pathname;
    response.writeHead(200, {"Content-Type": "text/html"});

    if (request) response.write(routeHandler(path));
    console.log("Request \"" + path + "\" processed.");

    if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            var POST = queryStr.parse(body);
            if (POST["data"] != null) {
                console.log("POST \"" + POST["data"] + "\" has been received");
                response.write("<div style='position: absolute; bottom: 10px;'><h3>POST \"" + POST["data"] + "\" has been received</h3></div>");
                response.end();
            }
        });
    }
    else if (request.method == 'GET') {
        var GET = url.parse(request.url, true).query;
        if (GET["data"] != null) {
            console.log("GET \"" + GET["data"] + "\" has been received");
            response.write("<div style='position: absolute; bottom: 10px;'><h3>GET \"" + GET["data"] + "\" has been received</h3></div>");
            response.end();
        }
    }
}

function routeHandler(path) {
    var filePath = "./www" + path + "/index.html";
    switch (path) {
        case  "/about":
            console.log("Give away about info");
            return "<center><p><h1>SimpleWebServer 1.0</h1></p><br><br>This page was generated statically " +
                "by server powers.<br><br><a href='/'><---  Back  <---</a>";
        case "/":
            filePath = "./www/index.html";
        default:
            if (path.indexOf('.html') > 0) filePath = "./www" + path;
            try {
                var content = file.readFileSync(filePath);
            }
            catch (error) {
                console.error("Request to nonexistent file: " + filePath);
                return "<center><h2>404: Nonexistent page</h2><br><a href=\"/\"><--- Back <---</a></center>";
            }
            console.log("Give away file: " + filePath);
            return content;
    }
}

function startServer() {
    http.createServer(requestHandler).listen(serverPort, serverHost);
    console.log("Server running at " + serverHost + ":" + serverPort);
}

exports.startServer = startServer;