const express = require('express');
const { HaxorService } = require('../services/haxorService');

const router = express.Router();
const haxorService = new HaxorService();

router.get('/haxor/:start/:end', async (req, res) => {
  const startPage = parseInt(req.params.start);
  const endPage = parseInt(req.params.end);

  if (isNaN(startPage) || isNaN(endPage) || startPage > endPage) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const urls = await haxorService.startGrab(startPage, endPage);
    const link = urls.join('\n');

    const message = `𝗚𝗿𝗮𝗯 𝗩𝘂𝗹𝗻𝗲𝗿𝗮𝗯𝗹𝗲 𝗦𝗶𝘁𝗲𝘀 𝗳𝗿𝗼𝗺 𝗛𝗮𝘅.𝗼𝗿.𝗜𝗗💱:\n\nRemove ()\n\n${link}\n\n𝗣𝗮𝗴𝗲: ${startPage} to ${endPage}`;

    res.json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch vulnerable sites' });
  }
});

module.exports = router;
