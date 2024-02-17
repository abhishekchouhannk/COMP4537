// const utils = require('.modules/util.js');

const http = require('http');
const url = require('url');
const fs = require('fs'); // for persistence utilize a file system

const FILE_PATH = 'data.json';

function loadDictionary() {
  try {
    const data = fs.readFileSync(FILE_PATH);
    return JSON.parse(data);
  } catch (error) {
    console.log('Error loading dictionary:', error);
    return {};
  }
}

function saveDictionary(dictionary) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(dictionary, null, 2));
    console.log('Dictionary saved succesfully.');
  } catch (error) {
    console.log('Error saving dictionary:', error);
  }
}

let requestsMade = 0;
let dictionary = loadDictionary();

function handleGetRequest(req, res) {

  if (req.url != "/favicon.ico") {
    // append number of requests made
    requestsMade++;
  }
  
  // const name = query.name || 'Friend';
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/') {
    trivia(res);
  } else if (parsedUrl.pathname === '/dictionary') {
    sendDefinition(req, res);
  }
}

function handlePostRequest(req, res) {
  if (req.url !== '/dictionary/writeWord') {
    res.writeHead(404, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
    res.end('Not Found');
    return;
  }


  let data = '';

  req.on('data', chunk => {
    data += chunk;
  });

  req.on('end', () => {
    try {
      const jsonData = JSON.parse(data);

      const word = jsonData.word;
      const definition = jsonData.definition;

      if (word && definition) { // if both word and definition were sent
        dictionary[word] = definition;

        saveDictionary(dictionary);

        // const jsonResponse = JSON.stringify(jsonResponseObj);
        res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
        res.end('Added word');
      }
    } catch (error) {
      console.log(error);
      res.writeHead(400, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
      res.end('Invalid json data');
    }

  });
}

function route(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);
  if (req.method === 'GET') {
    handleGetRequest(req, res); 
  } 
  else if (req.method === 'POST') {
    handlePostRequest(req, res);
  }
  else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
  }
}

function sendDefinition(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const query = parsedUrl.query;
  const wordQueried = query.word;

  let definition = dictionary[wordQueried] || ""; // Use default value if word is not found

  const jsonResponseObj = {
    success: definition !== "", // Check if a definition was found
    word: wordQueried,
    definition: definition !== "" ? definition : "Word not found in dictionary"
  };

  const jsonResponse = JSON.stringify(jsonResponseObj);

  res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
  res.end(jsonResponse);
}

// serve get for '/' route
function trivia(res) {
  const jsonObj = {
    totalRequests : requestsMade,
    hello         : 'world',
    owner         : 'Abhishek Chouhan'
  }
  const jsonResponse = JSON.stringify(jsonObj);

  res.writeHead(200, {'Content-Type': 'text/json'});
  res.end(jsonResponse);
}

const server = http.createServer(route);
const PORT = process.env.PORT || 8000; // use port provided by service or 8000

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// fetch('/dictionary/writeWord', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     word: 'test',
//     definition: 'a test of skillls'
//   })
// })
// .then(response => {
//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }
//   return response.text();
// })
// .then(data => {
//   console.log(data); // Process response data here
// })
// .catch(error => {
//   console.error('There was a problem with your fetch operation:', error);
// });
