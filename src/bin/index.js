import express from 'express';
import { resolve } from 'path';
import { config } from 'dotenv';
import Storage from '../models/storage';
import { init, catchAllErrors, processInvalidRequest } from '../middlewares/index';
import { processLogged } from '../middlewares/auth/index';
import mainRouter from '../routes/index';

config();
const store = new Storage();
const app = express();
const port = process.env.PORT;

app.set('x-powered-by', false);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(resolve(__dirname, '../public')));

app.use(init(store));
app.use(processLogged);

app.use('/', mainRouter);
app.use(processInvalidRequest);
app.use(catchAllErrors);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
export default app;
