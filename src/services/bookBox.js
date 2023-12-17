// services/lawsService.js
const lawsData = require('../database/48-laws-of-Power.json');

function getAllLaws() {
  return lawsData;
}

function getRandomLaw() {
  const randomIndex = Math.floor(Math.random() * lawsData.length);
  return lawsData[randomIndex];
}

module.exports = {
  getAllLaws,
  getRandomLaw,
};
