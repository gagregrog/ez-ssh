'use strict';

const fs = require('fs-extra');
const { err, log } = require('./util');
const { fileName } = require('./constants');

const json = module.exports = {};

const file = `${__dirname}/../../${fileName}`;

json.read = async () => {
  try {
    const fileExists = await fs.exists(file);

    if (fileExists) {
      const arr = await fs.readJson(file);

      return arr;
    } 
    
    return {};
  } catch (e) {
    err(`Failed at reading ${fileName}. Please try again.`);

    return null;
  }
};

json.write = async (keys) => {
  try {
    await fs.writeJson(fileName, keys);

    return true;
  } catch (e) {
    err(`Failed at writing ${fileName}.`);

    return null;
  }
};

json.deleteCommand = async (keys, key) => {
  delete keys[key];
  const success = await json.write(keys);
  
  if (success) log(`Key "${key}" deleted successfully.`);
  else err(`Could not delete key ${key}. Please try again.`);
};
