const express = require('express');
const { readLogs } = require('../services/fbLogService');

const router = express.Router();

router.get('/fblog', async (req, res) => {
  try {
    const logs = await readLogs();
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Error' });
  }
});

module.exports = router;
