// src/services/animeService.js
const AnimeFact = require("waifu.it");

class AnimeService {
  constructor(apiToken) {
    this.api = new AnimeFact(apiToken);
  }

  async getAnimeFact() {
    try {
      const fact = await this.api.getFact();
      return fact;
    } catch (error) {
      throw new Error("Failed to fetch anime fact");
    }
  }

  async getAnimeQuote() {
    try {
      const quote = await this.api.getQuote();
      return quote;
    } catch (error) {
      throw new Error("Failed to fetch anime quotes");
    }
  }

  async getAnimeWaifu() {
    try {
      const waifu = await this.api.getWaifu();
      return waifu;
    } catch (error) {
      throw new Error("Failed to fetch anime waifu");
    }
  }
}

module.exports = AnimeService;
