const axios = require('axios');
const { parse } = require('url');

class HaxorService {
  async startGrab(firstPage, lastPage) {
    const mainUrl = 'https://hax.or.id/archive?page=';
    const urls = [];

    for (let page = firstPage; page <= lastPage; page++) {
      const url = mainUrl + page;
      const response = await axios.get(url);
      const links = response.data.match(/<a[^>]+href=["'](https?:\/\/[^"']+)["'][^>]*>/gi);

      links.forEach((link) => {
        const href = link.match(/href=["'](https?:\/\/[^"']+)["']/i)[1];
        const parsedUrl = parse(href);
        const safeUrl = parsedUrl.protocol + '//' + parsedUrl.host.replace(/\./g, '(.)') + '/';
        urls.push(safeUrl);
      });
    }

    return urls;
  }
}

module.exports = { HaxorService };
