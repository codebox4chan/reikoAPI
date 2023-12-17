  const express = require('express');
  const { NikkeService } = require('../services/nikkeBox');

  const router = express.Router();
  const nikkeService = new NikkeService();

  router.get('/nikke', (req, res) => {
    const randomImageURL = nikkeService.getRandomImageURL();
    res.send({ imageURL: randomImageURL });
  });

  router.get('/upload/nikke', (req, res) => {
    const { link } = req.query;

    if (!link || !isValidURL(link)) {
      return res.status(400).json({ error: 'Url is not Valid!' });
    }

    const allowedExtensions = ['jpg', 'png', 'gif', 'webp', 'mp4', 'bmp', 'jpeg', 'tiff'];
    const isValidExtension = allowedExtensions.some(ext => link.endsWith(`.${ext}`));

    if (!isValidExtension) {
      return res.status(400).json({ error: 'Unsupported Extension!' });
    }

    nikkeService.addNikkeURL(link);
    res.json({ uploadURL: `${link} Nikke URL uploaded successfully.` });
  });

  function isValidURL(url) {
    const urlRegex = /^https?:\/\/.*\.(jpg|png|gif|webp|mp4|bmp|jpeg|tiff)$/i;
    return urlRegex.test(url);
  }

  module.exports = router;
