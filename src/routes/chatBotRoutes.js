const express = require('express');
const { generateChatResponse } = require('../services/chatBotService');

const router = express.Router();

router.get('/chat', async (req, res) => {
  const question = req.query.question;

  if (!question) {
    return res.status(400).json({ error: 'Question parameter is required.' });
  }

  try {
    const result = await generateChatResponse(question);
    res.json({ body: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

module.exports = router;
