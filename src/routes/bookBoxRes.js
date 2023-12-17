const express = require('express');
const router = express.Router();
const lawsService = require('../services/bookBox');
const facts = require('../database/random-fun-facts');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

router.get('/laws', (req, res) => {
  const allLaws = lawsService.getAllLaws();
  res.json(allLaws);
});

router.get('/random-law', (req, res) => {
  const randomLaw = lawsService.getRandomLaw();
  res.json(randomLaw);
});

router.get('/random-fact', (req, res) => {
  const randomFact = facts.getRandomFacts();
  res.json(randomFact);
});

const quotesPath = path.join(__dirname, '../database/quotes.json');
const quotes = JSON.parse(fs.readFileSync(quotesPath, 'utf8'));

router.get('/random-quote', (req, res) => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    res.json(randomQuote);
});

router.get('/random-rizz', async (req, res) => {
  try {
    const response = await axios.get('https://vinuxd.vercel.app/api/pickup');

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
