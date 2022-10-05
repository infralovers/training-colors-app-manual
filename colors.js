#!/usr/bin/env nodejs

// Change color here:
var mycolor = 'orange';

var http = require('http');
var url = require('url');
var os = require('os');
var fs = require('fs');

var hostname = os.hostname();
var debug = true;
var serverport = process.env.PORT || 8080;
var readyRequestCount = process.env.READY_COUNT || 5;
var liveRequestCount = process.env.LIVE_COUNT || 5;
var font_color = 'black';
if (mycolor == 'black') {
  font_color = 'white';
}

// https://gist.githubusercontent.com/joelpt/3824024/raw/df31dca35b84ff3f2a4a4d8bd21606ae8c671bdd/squirt.js
// The Babylonian Method
// http://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method
// @param n - the number to compute the square root of
// @param g - the best guess so far (can omit from initial call)
function squirt(n, g) {
  if (!g) {
    // Take an initial guess at the square root
    g = n / 2.0;
  }
  var d = n / g; // Divide our guess into the number
  var ng = (d + g) / 2.0; // Use average of g and d as our new guess
  if (g == ng) {
    // The new guess is the same as the old guess; further guesses
    // can get no more accurate so we return this guess
    return g;
  }
  // Recursively solve for closer and closer approximations of the square root
  return squirt(n, ng);
}

function delay(time) {
  setTimeout(function () {
    console.log('This printed after about ' + time);
  }, time);

}

var rIdx = 0;

function handleReady(req, res) {

  console.log((new Date()) + ' Received ready request ' + rIdx + ' of ' + readyRequestCount);

  if (rIdx < readyRequestCount) {
    rIdx += 1
    delay(1000)
    res.setHeader("Content-Type", "application/json");
    res.writeHead(404);
    res.end(`{"status": "not ready"}`);
    return
  }

  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(`{"status": "ready"}`);
};

var lIdx = 0

function handleLive(req, res) {
  console.log((new Date()) + ' Received live request ' + lIdx + ' of ' + liveRequestCount);

  if (lIdx < readyRequestCount) {
    lIdx += 1
    delay(1000)
    res.setHeader("Content-Type", "application/json");
    res.writeHead(404);
    res.end(`{"status": "still not alive"}`);
    return
  }
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(`{"status": "alive"}`);
}

function handleRequest(req, res) {

  switch (req.url) {
    case "/health/ready":
      handleReady(req, res)
      break
    case "/health/live":
      handleLive(req, res)
      break
    case "/":
      handleIdx(req, res)
      break;
    default:
      res.writeHead(404);
      res.end('error:"Resource not found"');
  }
}

function handleIdx(req, res) {

  var query = url.parse(req.url, true).query;

  if (debug) {
    console.log((new Date()) + ' Received request for color ' + mycolor + ' on URL ' + req.url);
  }

  if (query.burncpu > 1) {
    var x = 0.0001;
    for (var i = 0; i < query.burncpu; i++) {
      x = squirt(x);
    }
  }

  const headerItemList = []

  for (const headerItem of Object.keys(req.headers).sort()) {
    headerItemList.push(`<tr><td>${headerItem}:</td><td>${req.headers[headerItem]}</td></tr>`);
  }

  const htmlFile = 'index.html';
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("X-Processed-By", hostname);
  res.setHeader("X-Processed-Color", mycolor);
  fs.readFile(__dirname + '/index.html', 'utf-8', function (error, data) {
    if (error) {
      console.log((new Date()) + ' error on URL ' + req.url + ': ' + error);
      res.writeHead(404);
      res.write('Whoops! File not found!');
    } else {

      data = data.replace(/\$background_color/g, mycolor);
      data = data.replace(/\$font_color/g, font_color);
      data = data.replace(/\$hostname/g, hostname);
      data = data.replace(/\$headers/g, headerItemList.join('\n'))

      res.write(data);
    }
    res.end();
  })

}

var wsrv = http.createServer(handleRequest);

wsrv.listen(serverport, function () {
  console.log("Server listening on port %s for color %s", serverport, mycolor);
});

process.on('SIGTERM', function () {
  wsrv.close(function () {
    process.exit(0);
  });
});
