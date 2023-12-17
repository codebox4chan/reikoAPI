// src/routes/animeRoutes.js
const express = require("express");
const router = express.Router();
const AnimeService = require("../services/animeBox");

// Replace <TOKEN> with your API Token
const animeService = new AnimeService("MTExNDg1OTc2ODQ0ODgyMzM1OQ--.MTcwMDgzMzMxNw--.09b49e6b3f12");

router.get("/anime-fact", async (req, res) => {
  try {
    const fact = await animeService.getAnimeFact();
    res.json({ fact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/anime-quote", async (req, res) => {
  try {
    const quote = await animeService.getAnimeQuote();
    res.json({ quote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/anime-waifu", async (req, res) => {
  try {
    const waifu = await animeService.getAnimeWaifu();
    res.json({ waifu });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
