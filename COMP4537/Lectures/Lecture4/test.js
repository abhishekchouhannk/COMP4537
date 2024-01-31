const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer(function(req, res) {
  if (req.url === '/favicon.ico') {
    // Serve the favicon file
    const faviconPath = path.join(__dirname, 'favicon.png');
    fs.readFile(faviconPath, function(err, data) {
      if (err) {
        // If the favicon file can't be read, log the error
        console.error('Error reading favicon file:', err);
        res.writeHead(404);
        res.end();
      } else {
        // Set the appropriate content type and serve the favicon file
        res.writeHead(200, {'Content-Type': 'image/x-icon'});
        res.end(data);
      }
    });
  } else {
    console.log("req received");
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Hello <b>World</b>');
  }
}).listen(8888);

console.log('Server is running and listening');
