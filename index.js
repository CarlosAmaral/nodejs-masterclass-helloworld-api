// Node modules imports
const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const StringDecoder = require("string_decoder").StringDecoder;

// File imports
const config = require("./config");

// Instantiate the HTTP server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res)
});

// Start the HTTP server
httpServer.listen(config.httpPort, () => {
    console.log("Your HTTP server has started in the following port: ", config.httpPort)
});

// Instantiate the HTTPS server
const httpsServerOptions = {
    'key': fs.readFileSync("./https/key.pem"),
    'cert': fs.readFileSync("./https/cert.pem")
}

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res)
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, () => {
    console.log("Your HTTPS server has started in the following port: ", config.httpsPort)
});

const unifiedServer = (req, res) => {

    /**
     * Parse and trim the url to remove added bars at the end
     */

    const parsedURL = url.parse(req.url, true);
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    /**
     * Check the http method
     */

    const httpMethod = req.method.toLowerCase();

    /**
    * Parse query string
    */

    const queryString = parsedURL.query;

    /**
     * Parse headers
     */

    const parseHeaders = req.headers;

    /**
     * Parse payload
     */

    const decoder = new StringDecoder('utf-8');

    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    })
    req.on('end', () => {
        buffer += decoder.end();


        const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        const data = {
            "trimmedPath": trimmedPath,
            "queryString": queryString,
            "method": httpMethod,
            "headers": parseHeaders,
            "payload": buffer
        };

        chosenHandler(data, (statusCode, payload) => {
            // Use the status code called back by the handlder

            statusCode = typeof (statusCode == 'number') ? statusCode : 200;

            payload = typeof (payload == 'object') ? payload : {};

            const payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode)
            res.end(payloadString);
        })
    })
}


// Define handlers
let handlers = {};

// Hello World handler
handlers.helloWorld = (data, cb) => {
    cb(200, {"title": "Hello World, here I come"})
}

// Not found handler
handlers.notFound = (data, cb) => {
    cb(404)
}


const router = {
    "hello": handlers.helloWorld
}