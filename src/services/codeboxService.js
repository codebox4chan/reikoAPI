const { v4: uuidv4 } = require('uuid');
const Database = require('better-sqlite3');

const db = new Database(':memory:');

const initializeDatabase = () => {
  const stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS codes (
      id TEXT PRIMARY KEY,
      data TEXT,
      filename TEXT
    )
  `);
  stmt.run();
};

const generateUniqueId = () => uuidv4();

const insertCode = (id, data, filename) => {
  const insertStmt = db.prepare('INSERT INTO codes (id, data, filename) VALUES (?, ?, ?)');
  insertStmt.run(id, data, filename);
};

const getCodeById = (id) => {
  const selectStmt = db.prepare('SELECT data FROM codes WHERE id = ?');
  return selectStmt.get(id);
};

module.exports = {
  initializeDatabase,
  generateUniqueId,
  insertCode,
  getCodeById,
};
