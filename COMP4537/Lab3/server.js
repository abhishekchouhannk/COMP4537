const utils = require('./modules/utils.js');
const { userFacingString } = require('./lang/en/en.js');

const http = require('http');
const url = require('url');


function route(req, res) {
  const parsedUrl = url.parse(req.url, true); // Parse the request URL
  const query = parsedUrl.query; // Extract the query parameters
  const name = query.name || 'Friend'; // Use a default value if 'name' parameter is not provided
  
  if (parsedUrl.pathname === '/getDate') { // Check if the request path matches '/getDate'
    const currentDate = new Date().toLocaleString(); // Get the current date and time
    const response = `${userFacingString.replace('%1', name)} * ${utils.getCurrentDateTimeString()};`

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`<p style='color: blue;'>${response}</p>`);
  } else if (parsedUrl.pathname === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`<p style='color: blue;'>Please visit /getDate?name=YourName</p>`);
  }
   else {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<p style="color: red;">404 - Not Found</p>');
  }
}

const server = http.createServer(route);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})