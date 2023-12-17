// services/userAgentService.js
const randomUseragent = require('random-useragent');

class UserAgentService {
  static getRandomUserAgent() {
    return randomUseragent.getRandom();
  }
}

module.exports = UserAgentService;
