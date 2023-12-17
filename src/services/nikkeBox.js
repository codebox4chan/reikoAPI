const { readFile, writeFile } = require('../utils/fileUtils');

class NikkeService {
  constructor() {
    this.nikkeURLs = this.readNikkeURLsFromJSON(); // Read URLs from JSON file
  }

  readNikkeURLsFromJSON() {
    try {
      const rawData = readFile('./src/database/nikkeURL.json');
      const nikkeURLs = JSON.parse(rawData);
      return nikkeURLs;
    } catch (error) {
      console.error('Error reading nikkeURL.json:', error);
      return [];
    }
  }

  writeNikkeURLsToJSON() {
    const data = JSON.stringify(this.nikkeURLs, null, 2);
    writeFile('./src/database/nikkeURL.json', data);
  }

  addNikkeURL(url) {
    this.nikkeURLs.push(url);
    this.writeNikkeURLsToJSON();
  }

  getRandomImageURL() {
    const randomIndex = Math.floor(Math.random() * this.nikkeURLs.length);
    return this.nikkeURLs[randomIndex];
  }
}

module.exports = { NikkeService };
