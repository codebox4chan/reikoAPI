const express = require('express');
const FbLogsService = require('../services/fbUPBox');

const router = express.Router();
const fbLogsService = new FbLogsService();

router.get('/getfblogs', async (req, res) => {
  try {
    const pasteLinks = await fbLogsService.getPasteLinks();
    res.json(pasteLinks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
