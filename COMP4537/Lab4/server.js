// const utils = require('.modules/util.js');

const http = require('http');
const url = require('url');

// empty dictionary at first
const dictionary = {
  owner  : "Abhishek",
  client : "Amarjot",
  lab    : "Lab4",
  THISNOTAWORD$$Requests: 0
};


function handleGetRequest(req, res) {

  if (req.url != "/favicon.ico") {
    // append number of requests made
    dictionary['THISNOTAWORD$$Requests']++;
  }
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/') {
    trivia(res);
  } else if (parsedUrl.pathname === '/dictionary') {
    sendDefinition(req, res);
  }
}

function handlePostRequest(req, res) {
  dictionary['THISNOTAWORD$$Requests']++;

  if (req.url !== '/dictionary/writeWord') {
    res.writeHead(404, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
    res.end('Not Found');
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
        if (dictionary[word]) {
          sendRes(res, 'Word Already exists.');
        } else {
          dictionary[word] = definition;
          sendRes(res, 'Word Added succesfully.')
        }
      } else {
        sendRes(res, 'Error on server side.')
      }
    } catch (error) {
      console.log(error);
      sendRes(res, 'Error processing json on server side.')
    }
  });
}

function sendRes(res, message) {
  const jsonResponse = JSON.stringify({ success: true, message: message, numRequests: dictionary['THISNOTAWORD$$Requests'] });
  res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
  res.end(jsonResponse);
}



function route(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);
  if (req.method === 'GET') {
    handleGetRequest(req, res); 
  } 
  else if (req.method === 'POST') {
    handlePostRequest(req, res);
  }
  else if (req.method === 'OPTIONS') {
    // Handle preflight request
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
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
    definition: definition !== "" ? definition : "Word not found in dictionary",
    numRequests: dictionary['THISNOTAWORD$$Requests']
  };

  const jsonResponse = JSON.stringify(jsonResponseObj);

  res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
  res.end(jsonResponse);
}

// serve get for '/' route
function trivia(res) {
  const jsonObj = {
    totalRequests : dictionary['THISNOTAWORD$$Requests'],
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
//     word: 'present',
//     definition: 'a past future being experienced right now'
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