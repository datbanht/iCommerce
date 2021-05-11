const bunyan = require('bunyan');

// load package.json
const pjs = require('../../package.json');

// Get some meta info from the package.json
const { name, version } = pjs;

const getLogger = (serviceName, serviceVersion, level) => bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });

module.exports = {
  development: {
    name,
    version,
    serviceRegistryUrl: 'http://localhost:3000',
    serviceVersionIdentifier: '1.x.x',
    log: () => getLogger(name, version, 'debug'),
  },
  production: {
    name,
    version,
    serviceRegistryUrl: 'http://localhost:3000',
    serviceVersionIdentifier: '1.x.x',
    log: () => getLogger(name, version, 'info'),
  },
};
