const express = require("express");
const routes = require("./routes");
const config = require('./config')[process.env.NODE_ENV || 'development'];

const log = config.log();
const app = express();

app.use(express.json());
app.use("/", routes);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

app.use((req, res, next) => {
  log.debug(`${req.method}: ${req.url}`);
  return next();
});

const server = app.listen(config.port);
app.on('listening', () => {
  log.info(`Hi there! I'm a '${config.name}' and listening on port ${server.address().port} in ${service.get('env')} mode.`);
});

module.exports = {
  app: app,
  server: server
}
