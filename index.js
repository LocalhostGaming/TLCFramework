import Lost from './lost';
import server from './callbackEvent/server';
import client from './callbackEvent/client';

const { onNetCallback } = server;
const { emitNetCallback } = client;

export {
  onNetCallback,
  emitNetCallback,
};

export default Lost;
