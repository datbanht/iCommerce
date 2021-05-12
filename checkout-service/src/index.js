const http = require('http');
const axios = require('axios');
const config = require('./config')[process.env.NODE_ENV || 'development'];
const service = require('./server/service')(config);
const CheckoutConsumer = require('./common/checkoutConsumer')

const log = config.log();
const server = http.createServer(service);

// server.listen(process.env.PORT || 3000);
server.listen(0); // node.js randomly select any port

server.on('listening', () => {
  const registerService = () => axios.put(`http://localhost:3000/register/${config.name}/${config.version}/${server.address().port}`);
  const unregisterService = () => axios.delete(`http://localhost:3000/register/${config.name}/${config.version}/${server.address().port}`);

  registerService();

  const interval = setInterval(registerService, 20000); // 20 miliseconds
  const cleanup = async () => {
    clearInterval(interval);  // set Interval not run anymore
    await unregisterService();
  };

  // implement different handler
  process.on('uncaughtException', async () => {
    await cleanup();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    await cleanup();
    process.exit(0);
  });

  // killing the process
  process.on('SIGTERM', async () => {
    await cleanup();
    process.exit(0);
  });

  log.info(
    `Hi there! I'm a '${config.name}' and listening on port ${server.address().port} in ${service.get('env')} mode.`,
  );
});

const c = new CheckoutConsumer();
c.start();