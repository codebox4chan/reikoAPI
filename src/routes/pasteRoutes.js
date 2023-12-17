const express = require('express');
const PastebinService = require('../services/pasteService');

const router = express.Router();
const pastebinService = new PastebinService();

router.post('/create', (req, res) => {
  const { content, title } = req.body;

  if (!content || !title) {
    return res.status(400).json({ error: 'Content and title are required.' });
  }

  const paste = pastebinService.createPaste(content, title);
  res.json(paste);
});

router.get('/get/:id', (req, res) => {
  const id = req.params.id;
  const paste = pastebinService.getPaste(id);

  if (!paste) {
    return res.status(404).json({ error: 'Paste not found.' });
  }

  const filePath = `paste/${id}.txt`;
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  res.json({ id, title: paste.title, content: fileContent });
});

router.get('/getAll', (req, res) => {
  const pastes = pastebinService.getAllPastes();
  res.json(pastes);
});

module.exports = router;

