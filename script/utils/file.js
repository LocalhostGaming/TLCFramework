import fs from 'fs';

export default {
  async write(filename, payload) {
    try {
      await fs.writeFileSync(filename, JSON.stringify(payload), 'utf-8');
      return true;
    } catch (error) {
      return false;
    }
  },

  async read(filename) {
    if (await !fs.existsSync(filename)) {
      throw new Error(`${filename} doesn't exists`);
    }

    try {
      const json = await fs.readFileSync(filename);
      const data = JSON.parse(json);

      return data;
    } catch (error) {
      return error.message;
    }
  },

  async remove(filename) {
    if (await !fs.existsSync(filename)) {
      throw new Error(`${filename} doesn't exists`);
    }

    try {
      await fs.unlinkSync(filename);
      return true;
    } catch (error) {
      return false;
    }
  },
};
