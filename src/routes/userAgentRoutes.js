// routes/userAgentRoutes.js
const express = require('express');
const UserAgentService = require('../services/userAgentService');

const router = express.Router();

router.get('/random/agent', (req, res) => {
  const userAgent = UserAgentService.getRandomUserAgent();
  res.send({ UA: `${userAgent}` });
});

module.exports = router;
