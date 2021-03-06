#!/usr/bin/env node

const http = require('http');

const config = require('./config')[process.env.NODE_ENV || 'development'];

const log = config.log();
const service = require('./service/service')(config);

const server = http.createServer(service);

server.listen(process.env.PORT || 3000);

server.on('listening', () => {
  log.info(`Hi there! I'm a '${config.name}' and listening on port ${server.address().port} in ${service.get('env')} mode.`);
});
