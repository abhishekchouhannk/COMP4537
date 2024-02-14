// const http = require("http");
// const url = require("url");

// http.createServer(function(req, res) {
//   console.log("The server received a request");
//   let q = url.parse(req.url, true);
//   console.log(q.query)
//   res.writeHead(200, {
//     "Content-Type": "text/html",
//     // "Access-Control-Allow-Origin": "*"
//   });
//   res.end('<b>Hello</b> ' + q.query["name"]);
// }).listen(8888);

const axios = require('axios');

async function requestSecret() {
  try {
    const response = await axios.post('http://apiz.ca/secrete', {
      question: "What's the secret?"
    });

    console.log('Response:', response.data);
    return response.data; // Return the response data if needed
  } catch (error) {
    console.error('Error:', error.response ? error.response.statusText : error.message);
    throw error; // Throw the error to handle it in the calling function
  }
}

// Call the function to make the request
requestSecret();
