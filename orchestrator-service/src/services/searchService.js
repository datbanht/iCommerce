const urlLib = require('url');
const axios = require('axios');
const crypto = require('crypto');

const CircuitBreaker = require('../common/circuitBreaker');

const circuitBreaker = new CircuitBreaker();

class SearchService {
  constructor({ serviceRegistryUrl, serviceVersionIdentifier }) {
    this.serviceVersionIdentifier = serviceVersionIdentifier;
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.cache = {};
  }

  async getProducts({ url }) {
    const { ip, port } = await this.getService('search-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}${url}`,
    });
  }

  async callService(requestOptions) {
    const parsedUrl = urlLib.parse(requestOptions.url);
    const cacheKey = crypto.createHash('md5').update(`${requestOptions.method}${parsedUrl.path}`).digest('hex');

    const result = await circuitBreaker.callService(requestOptions);

    if (!result) {
      if (this.cache[cacheKey]) {
        return this.cache[cacheKey];
      }
      return null;
    }

    this.cache[cacheKey] = result;
    return result;
  }

  async getService(servicename) {
    const response = await axios.get(`${this.serviceRegistryUrl}/find/${servicename}/${this.serviceVersionIdentifier}`);
    return response.data;
  }
}

module.exports = SearchService;
