import express from 'express';
import { json } from 'body-parser';
import { resolve } from 'path';
import process from 'process';
import Controllers from '../controllers/index';

process.env.STORAGE_PREFIX = (process.env.NODE_ENV === 'test' ? 'test_' : 'main_');
const Storage = new Map();
const app = express();
const port = 3000;

app.use(json());
app.use(express.static(resolve(__dirname, '../public')));
app.use((req, res, next) => {
  req.STORAGE = Storage;
  next();
});
app.use('/', Controllers);


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
export default app;
