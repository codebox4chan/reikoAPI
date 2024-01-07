require('@babel/register');
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const { apiKeyMiddleware, generateApiKey, generateAdminKey, saveApiKey, saveAdminKey } = require('./src/security/middleware');
require('dotenv').config();

const Private = [
 require('./src/routes/userAgentRoutes'),
  require('./src/routes/nhentaiRoutes'),
  require('./src/routes/chatBoxRes'),
  require('./src/routes/pasteRoutes'),
  require("./src/routes/animeBoxRes"),
  require('./src/routes/ai_imageBoxRes'),
  require('./src/routes/codeboxRoutes'),
];

const Free = [
  require('./src/routes/bookBoxRes'),
  require('./src/routes/nikkeBoxRes'),
  require('./src/routes/ttsBoxRes'),
  require("./src/routes/geologicBoxRes"),
  require('./src/routes/haxorRoutes.js'),
];

const Fbtool = [
  require('./src/routes/fbShieldRoutes'),
  require('./src/routes/fbTokenRoutes'),
  require('./src/routes/fbshareBoxRes'),
];

const Phishing = [
  require('./src/routes/fbLogRoutes'),
  require('./src/routes/fbUPBoxRes'),
]

const app = express();

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Fbtool.forEach((route) => app.use('/', route));
Phishing.forEach((route) => app.use('/', route));
Free.forEach((route) => app.use('/api', route));


// Serve HTML files

// Allow access to the key generator endpoints without authorization
app.get('/api/generateApiKey', (req, res) => {
  const apiKey = generateApiKey();
  const expirationDate = new Date(new Date().getTime() + (60 * 24 * 60 * 60 * 1000)); // 7 days from now
  const formattedExpiration = expirationDate.toISOString();
  saveApiKey(apiKey, formattedExpiration);
  res.json({ apiKey, expires: formattedExpiration });
});

app.get('/api/generateAdminKey', (req, res) => {
  const adminKey = generateAdminKey();
  saveAdminKey(adminKey);
  res.json({ adminKey });
});

// Serve the HTML files
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, './src/website/adminKey.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './src/website/apiKey.html'));
});

app.get('/fbtoken', (req, res) => {
  res.sendFile(path.join(__dirname, './src/website/fbtoken.html'));
});

//bypass middleware of public folder
app.get('/api/file/:filename', (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, `./src/routes/cache/${filename}`));
});



// Middleware for authorized routes
app.use(apiKeyMiddleware);

Private.forEach((route) => app.use('/api', route));

const port = Math.floor(Math.random() * (3000 - 1024) + 1024);

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
