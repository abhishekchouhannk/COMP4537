const http = require('http');

function route(req, res) {
  if (req.url === '/') {
    res.wrtieHead(200, {'Content-Type': 'text/plain'});
    res.end("Hello, this is Abhishek's Node api.");
  }
  else if (req.url === '/api/index.js') {
    res.wrtieHead(200, {'Content-Type': 'text/plain'});
    res.end("Hello, this is Abhishek's Node api.");
  }
  else {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('404 - Not Found');
  }
}

const server = http.createServer(route);

// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// })

module.exports = server;

// module.exports = (req, res) => {
//   res.status(200).send("<h1>Hello world</h1>");
// }