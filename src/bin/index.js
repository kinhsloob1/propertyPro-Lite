import app from './application';

const port = process.env.PORT || 3000;
export default app().listen(port, () => console.log(`Example app listening on port ${port}!`));
