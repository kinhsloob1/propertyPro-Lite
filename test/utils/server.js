import { createServer } from 'http';

class Server {
  static create(app) {
    return new Promise((resolve, reject) => {
      const server = createServer(app);
      server.on('error', () => {
        reject(new Error('A server error occured'));
      });

      server.listen(() => {
        const address = server.address();
        const url = `http://127.0.0.1:${address.port}`;
        resolve({
          url,
          server,
        });
      });
    });
  }
}

export default Server;
