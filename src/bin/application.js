import express from 'express';
import { resolve, join } from 'path';
import { config } from 'dotenv';
import Storage from '../models/storage';
import { init, catchAllErrors, processInvalidRequest } from '../middlewares/index';
import { processLogged } from '../middlewares/auth/index';
import mainRouter from '../routes/index';

export default () => {
  config();
  const store = new Storage();
  const app = express();

  app.set('x-powered-by', false);
  app.set('views', join(__dirname, '../../views'));
  app.set('view engine', 'ejs');
  app.use('/api/v1', express.static(resolve(__dirname, '../../public')));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(init(store));
  app.use(processLogged);
  app.use('/', mainRouter);
  app.use(processInvalidRequest);
  app.use(catchAllErrors);
  return app;
};
