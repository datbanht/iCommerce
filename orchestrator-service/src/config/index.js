const bunyan = require('bunyan');

// load package.json
const pjs = require('../../package.json');

// Get some meta info from the package.json
const { name, version } = pjs;

const getLogger = (serviceName, serviceVersion, level) => bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });

module.exports = {
  production: {    
    name: name,
    version: version,
    port: 3080,
    serviceRegistryUrl: 'http://localhost:3000',
    serviceVersionIdentifier: '1.x.x',
    log: () => getLogger(name, version, 'info'),
  },
  development: {
    name: name,
    version: version,
    port: 3080,
    serviceRegistryUrl: 'http://localhost:3000',
    serviceVersionIdentifier: '1.x.x',
    log: () => getLogger(name, version, 'debug'),
  },  
  testing: {
    name: name,
    version: version,
    port: 0,
    serviceRegistryUrl: 'http://localhost:3000',
    serviceVersionIdentifier: '1.x.x',
    log: () => getLogger(name, version, 'debug'),
  }
};
