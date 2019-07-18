import axios from 'axios';
import app from '../../src/bin/application';
import Server from './server';

export default async () => {
  try {
    const { url, server } = await Server.create(app());
    const instance = axios.create({
      baseURL: url,
      timeout: 1000,
      validateStatus: () => true,
    });
    return { server, request: instance };
  } catch (e) {
    throw e;
  }
};
