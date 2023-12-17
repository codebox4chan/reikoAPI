const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class PastebinService {
  constructor() {
    this.pasteDirectory = path.join(__dirname, '..', 'paste');
    fs.mkdirSync(this.pasteDirectory, { recursive: true });

    this.pastes = [];
  }

  createPaste(content, title) {
    const id = uuidv4();
    const paste = {
      id,
      title,
      created_at: new Date(),
    };

    const filePath = path.join(this.pasteDirectory, `${id}.txt`);
    fs.writeFileSync(filePath, content);

    this.pastes.push(paste);
    return paste;
  }

  getPaste(id) {
    return this.pastes.find(paste => paste.id === id);
  }

  getAllPastes() {
    return this.pastes;
  }
}

module.exports = PastebinService;
