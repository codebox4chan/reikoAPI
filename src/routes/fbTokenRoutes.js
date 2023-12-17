const express = require('express');
const { FbTokenService } = require('../services/fbTokenService');

const router = express.Router();
const fbTokenService = new FbTokenService();

router.get('/fb/token', async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return res.status(400).json({ message: 'Invalid Input' });
  }

  try {
    const tokenData = await fbTokenService.retrieveToken(username, password);

    res.json({
      access_token: tokenData.access_token,
      cookies: tokenData.cookies,
      access_token_eaad6v7: tokenData.access_token_eaad6v7
    });
  } catch (error) {
    res.status(500).json({ error: 'Server is Down!' });
  }
});

module.exports = router;
