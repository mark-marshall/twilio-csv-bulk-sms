// ================== Package Imports ==================
require('dotenv').config();
const app = require('./app');
const ngrok = require('ngrok');

// ================== Server Setup ==================
const port = process.env.PORT || '3000';

ngrok
  .connect({
    addr: port,
    subdomain: process.env.NGROK_SUBDOMAIN,
    authtoken: process.env.NGROK_TOKEN,
    region: 'eu',
  })
  .then(() => {
    app.listen(port, () =>
      console.log(`===== Server running on port ${port} =====`)
    );
  });
