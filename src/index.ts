// NPM imports
import express from 'express';
import bodyParser from 'body-parser';

// Application imports
import config from './config';
import loggerFactory from './utils/logging';
import { setupDB } from './initializer';

// Routes ...
import authRoutes from './routes/auth.routes';
import { tokenHandler, errorHandler, corsHandler, healthCheckHandler, correlationIdHandler } from './utils/middlewares';
import userRoutes from './routes/user.routes';

// Intializations
const logger = loggerFactory.getLogger();
const app = express();

// To avoid client to know about express
app.disable('x-powered-by');

// To avoid 304 content not modified status.
app.disable('etag');

let server: import('http').Server;
(async () => {
  await setupDB();
  app.get('/healthcheck', healthCheckHandler);

  app.all('/*', corsHandler);

  // logger
  app.use(
    loggerFactory.connectLogger(loggerFactory.getLogger('http'), {
      level: 'auto',
    }),
  );
  app.use(correlationIdHandler);
  // jwt-decode application/json
  app.use(tokenHandler);

  // parse application/json
  app.use(bodyParser.json());

  app.use('/auth-irp', authRoutes());
  app.use('/authenticate-irp', userRoutes());

  app.use(errorHandler);

  server = app.listen(config.port, () => {
    logger.info(`application is listening on port ${config.port} ...`);
  });
})().catch(err => {
  if (server && server.listening) server.close();
  logger.error(err);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  logger.error(err.stack);
  process.exit(1);
});