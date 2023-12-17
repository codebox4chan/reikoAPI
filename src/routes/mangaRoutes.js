const express = require('express');
const { MangaService } = require('../services/mangaService');

const router = express.Router();
const mangaService = new MangaService();

router.get('/manga', (_, res) => {
  res.status(200).json({
    intro: "Welcome to the mangadex provider: check out the provider's website @ https://mangadex.org/",
    routes: ['/:query', '/info/:id', '/read/:chapterId'],
    documentation: 'https://docs.consumet.org/#tag/mangadex',
  });
});

router.get('/manga/:query', async (req, res) => {
  const query = req.params.query;
  const page = req.query.page;

  try {
    const result = await mangaService.searchManga(query, page);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
});

router.get('/manga/info/:id', async (req, res) => {
  const id = decodeURIComponent(req.params.id);

  try {
    const result = await mangaService.getMangaInfo(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

router.get('/manga/read/:chapterId', async (req, res) => {
  const chapterId = req.params.chapterId;

  try {
    const result = await mangaService.getChapterPages(chapterId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
});

module.exports = router;
