const { MANGA } = require('@consumet/extensions');

class MangaService {
  constructor() {
    this.mangadex = new MANGA.MangaDex();
  }

  async searchManga(query, page) {
    try {
      const result = await this.mangadex.search(query, page);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getMangaInfo(id) {
    try {
      const result = await this.mangadex.fetchMangaInfo(id);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getChapterPages(chapterId) {
    try {
      const result = await this.mangadex.fetchChapterPages(chapterId);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { MangaService };
