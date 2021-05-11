const express = require('express');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const config = require('./config')[process.env.NODE_ENV || 'development'];
const routes = require('./routes');

const log = config.log();
const app = express();


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

app.use('/', routes());
app.use((req, res, next) => next(createError(404, 'File not found')));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  const status = err.status || 500;
  res.locals.status = status;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(status);
  return res.render('error');
});

// Add a request logging middleware in development mode
if (app.get('env') === 'development') {
  app.use((req, res, next) => {
    log.debug(`${req.method}: ${req.url}, query: ${req.query.name}`);
    return next();
  });
}

app.listen(3080);
app.on('listening', () => {
  log.info(
    `Hi there! I'm a 'orchestrator-service' and listening on port ${server.address().port} in ${service.get('env')} mode.`,
  );
});
module.export = app;
