const http = require('http');
const express = require('express');
var bodyParser = require('body-parser');
const fs = require('fs');
const template = require('./template');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const hostname = '127.0.0.1';
const port = 23456;

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
// Poor man's templating.
app.get('/', (req, res) => {
  res.send(template.createHtml());
});

app.post("/api/encode", (req, res, next) => {
  // Sanity check to ensure that everything we need is here.
  // Not protecting against over-posting, because we're not doing anything
  // with the extra properties
  const body = req.body;
  if (checkIncomingRequest(body)) {
    // Instructions ask for explicitly sending empty string.
    // Formatting is gross here, but pretty in the response.
    return res.status(500).send(`{
  "encodedMessage": ""
}`);
  }

  const shift = body.shift;
  const message = body.message;
  let encodedMessage = '';

  for (let i = 0; i < message.length; i++) {
    var char = message[i];
    // Check for letter, otherwise, just append
		if (char.match(/[a-z]/i)) {
      var code = char.charCodeAt(0);
      //Uppercase else if lowercase
			if ((code >= 65) && (code <= 90)) {
        // subtract 65 or 97, and add amount to get relative code for upper/lowercase letter
        // add 65 or 97 to get back in the correct charCode range.
        encodedMessage += String.fromCharCode(((code - 65 + shift) % 26) + 65);
      }	else if ((code >= 97) && (code <= 122)) {
        encodedMessage += String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
		} else {
      encodedMessage += char;
    }
  }
  writeMessageToDisk(encodedMessage, shift);
  res.json({encodedMessage: encodedMessage});
});

function checkIncomingRequest(body) {
  return body == null || !(body.shift != null && body.shift > 0) || !(body.message != null &&
    body.message != '');
}

function writeMessageToDisk(encodedMessage, shift) {
  var stream = fs.createWriteStream("encodedMessage.txt", {flags:'a'});
  stream.write(`${new Date().toISOString()} - message: ${encodedMessage} shift: ${shift}\n`);
  stream.end();
  console.log('Message saved successfully.');
}

