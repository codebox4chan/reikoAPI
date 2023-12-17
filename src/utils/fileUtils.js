const fs = require('fs');

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw new Error('Error reading file');
  }
}

function writeFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, data);
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
    throw new Error('Error writing to file');
  }
}

module.exports = { readFile, writeFile };
