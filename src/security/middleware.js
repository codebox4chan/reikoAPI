const fs = require('fs');
const path = require('path');

const apiKeyFile = path.join(__dirname, 'apiKey.json');
const adminKeyFile = path.join(__dirname, 'adminKey.json');

function readKeysFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeKeysToFile(filePath, keys) {
  fs.writeFileSync(filePath, JSON.stringify(keys, null, 2), 'utf8');
}

function generateApiKey() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateAdminKey() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function apiKeyMiddleware(req, res, next) {
  const providedKey = req.query.apiKey;

  if (!providedKey) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const allKeys = readKeysFromFile(apiKeyFile);
  const adminKeys = readKeysFromFile(adminKeyFile);

  const keyData = allKeys.find((key) => key.apiKey === providedKey) ||
                  adminKeys.find((key) => key.adminKey === providedKey);

  if (!keyData || (keyData.expires && new Date() > new Date(keyData.expires))) {
    return res.status(403).json({ error: 'Unauthorized - Expired or invalid key' });
  }

  // Check if the key is an admin key
  if (adminKeys.some((key) => key.adminKey === providedKey)) {
    req.isAdminKey = true;
  }

  next();
}

module.exports = {
  apiKeyMiddleware,
  generateApiKey,
  generateAdminKey,
  saveApiKey: (apiKey, expires) => {
    const allKeys = readKeysFromFile(apiKeyFile);
    allKeys.push({ apiKey, expires });
    writeKeysToFile(apiKeyFile, allKeys);
  },
  saveAdminKey: (adminKey) => {
    const currentAdminKeys = readKeysFromFile(adminKeyFile);

    if (!currentAdminKeys || currentAdminKeys.length === 0) {
      // If no admin keys exist, create a new entry
      writeKeysToFile(adminKeyFile, [{ adminKey }]);
    } else {
      // Append a new admin key with no expiration
      currentAdminKeys.push({ adminKey });
      writeKeysToFile(adminKeyFile, currentAdminKeys);
    }
  },
};

