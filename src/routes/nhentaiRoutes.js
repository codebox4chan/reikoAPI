// nhentaiRoutes.js
const express = require('express');
const NHentaiService = require('../services/nhentaiService');

const router = express.Router();
const nhentaiService = new NHentaiService();

router.get('/gallery/:id', async (req, res) => {
  const galleryId = req.params.id;
  try {
    const gallery = await nhentaiService.getGalleryById(galleryId);
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search/:keyword', async (req, res) => {
  const keyword = req.params.keyword;
  const page = req.query.page || 1;
  try {
    const searchResults = await nhentaiService.search(keyword, page);
    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/random', async (req, res) => {
  try {
    const randomGallery = await nhentaiService.getRandom();
    res.json(randomGallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
