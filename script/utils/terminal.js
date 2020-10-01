/* eslint-disable no-console */
import toptions from './toptions';

const { fg, bg, op } = toptions;

export default {
  log(message, title = 'LOG') {
    const head = `${bg.cyan + fg.black} ${title} ${op.reset}`;

    if (typeof message === 'object') {
      console.log(`${head} Object()`);
      console.log(message);
    } else {
      console.log(`${head} ${message} ${op.reset}`);
    }
  },

  info(message, title = 'INFO') {
    const head = `${bg.lblue + fg.black} ${title} ${op.reset}`;

    if (typeof message === 'object') {
      console.log(`${head} Object()`);
      console.log(message);
    } else {
      console.log(`${head} ${message} ${op.reset}`);
    }
  },

  warn(message, title = 'WARN') {
    const head = `${bg.yellow + fg.black} ${title} ${op.reset}`;

    if (typeof message === 'object') {
      console.log(`${head} Object()`);
      console.log(message);
    } else {
      console.log(`${head} ${message} ${op.reset}`);
    }
  },

  error(message, title = 'ERROR') {
    const head = `${bg.lred + fg.black} ${title} ${op.reset}`;

    if (typeof message === 'object') {
      console.log(`${head} Object()`);
      console.log(message);
    } else {
      console.log(`${head} ${message} ${op.reset}`);
    }
  },

  success(message, title = 'DONE') {
    try {
      const head = `${bg.lgreen + fg.black} ${title} ${op.reset}`;

      if (typeof message === 'object') {
        console.log(`${head} Object()`);
        console.log(message);
      } else {
        console.log(`${head} ${message} ${op.reset}`);
      }
    } catch (e) {
      console.log(e.message);
    }
  },

  custom(message) {
    console.log(message);
  },

};
