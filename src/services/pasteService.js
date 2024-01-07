const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class PastebinService {
  constructor() {
    this.pasteDirectory = path.join(__dirname, '..', 'paste');
    this.createDirectoryIfNotExists();

    this.pastes = [];
  }

  createDirectoryIfNotExists() {
    try {
      fs.mkdirSync(this.pasteDirectory, { recursive: true });
    } catch (error) {
      console.error(`Error creating paste directory: ${error.message}`);
      // Handle the error, perhaps by returning an error status or throwing an exception
    }
  }

  createPaste(content, title) {
    const id = uuidv4();
    const paste = this.buildPasteObject(id, title);
    const filePath = path.join(this.pasteDirectory, `${id}.txt`);

    this.savePasteToFile(filePath, content);
    this.pastes.push(paste);

    return paste;
  }

  buildPasteObject(id, title) {
    return {
      id,
      title,
      created_at: new Date(),
    };
  }

  savePasteToFile(filePath, content) {
    try {
      fs.writeFileSync(filePath, content);
    } catch (error) {
      console.error(`Error writing paste file: ${error.message}`);
      // Handle the error, perhaps by returning an error status or throwing an exception
    }
  }

  getPaste(id) {
    return this.pastes.find(paste => paste.id === id);
  }

  getAllPastes() {
    return this.pastes;
  }
}

module.exports = PastebinService;
