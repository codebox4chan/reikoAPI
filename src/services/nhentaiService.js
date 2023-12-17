// nhentaiService.js
const nHentaiAPI = require('nhentai-api-js');
const api = new nHentaiAPI();

class NHentaiService {
  async getGalleryById(id) {
    try {
      const gallery = await api.g(id);
      return gallery;
    } catch (error) {
      throw new Error('Error fetching gallery');
    }
  }

  async search(keyword, page = 1) {
    try {
      const searchResults = await api.search(keyword, page);
      return searchResults;
    } catch (error) {
      throw new Error('Error performing search');
    }
  }

  async getRandom() {
    try {
      const randomGallery = await api.random();
      return randomGallery;
    } catch (error) {
      throw new Error('Error fetching random gallery');
    }
  }
}

module.exports = NHentaiService;
