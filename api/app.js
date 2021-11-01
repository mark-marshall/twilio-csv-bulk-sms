// ================== Package Imports ==================
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
var cors = require('cors');

// ================== Initialise App ==================
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ================== Initialise Clients ==================
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ================== Endpoints ==================
// EP1: Sense check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Alive!' });
});

// Expects a request with body containing an array of messages [{to: E146 number, body: message body}]
app.post('/sendBulk', async (req, res) => {
  const msgList = req.body;

  // Basic approach, loop through all messages and send in sequence
  // for (const msg of msgList) {
  //   const { to, body } = msg;
  //   await twilioClient.messages.create({
  //     to,
  //     body,
  //     messagingServiceSid: process.env.TWILIO_MESSAGE_SERVICE_SID,
  //     // statusCallback: url to receive webhooks for status of message delivery
  //   });
  // }

  // Return random int to add to the message for testing purposes (sending the same message lots of times results in carrier blocking)
  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  };

  // To check blocks are processing in serial at human readable speed
  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // Performant approach, sending blocks of messages in parallel
  const msgListCopy = msgList.slice(0);
  // Divide the message list into blocks of n messages for API concurrency purposes
  const blockArr = [];
  while (msgListCopy.length) {
    const block = msgListCopy.splice(0, blockSize);
    blockArr.push(block);
  }
  // Block counter
  let curBlock = 0;
  // Loop through each n message block
  for (block of blockArr) {
    // Send block of n SMS in parallel
    await Promise.all(
      block.map(async (msg) => {
        const { to, body } = msg;
        // Make request to Twilio
        await twilioClient.messages.create({
          to,
          body: `${body}: ${getRandomInt(1, 1000)}`,
          messagingServiceSid: process.env.TWILIO_MESSAGE_SERVICE_SID,
          // statusCallback: url to receive webhooks for status of message delivery
        });
        // Optional access headers which show the current number of concurrent API requests
        // const lastResponse = twilioClient.httpClient.lastResponse;
        // await timeout(300);
      })
    );
    console.log(`Block: ${curBlock} finished`);
    curBlock += 1;
  }
  res.status(200).json({ msgList });
});

module.exports = app;
