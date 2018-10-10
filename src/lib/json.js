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
      const commands = await fs.readJson(file, { throws: false });

      return commands || {};
    } 
    
    return {};
  } catch (e) {
    err(`Failed at reading ${fileName}. Please try again.`);

    return null;
  }
};

json.write = async (commands) => {
  try {
    await fs.writeJson(file, commands);

    return true;
  } catch (e) {
    err(`Failed at writing ${fileName}.`);

    return null;
  }
};

json.deleteCommand = async (command, commands) => {
  delete commands[command];
  const success = await json.write(commands);
  
  if (success) log(`Alias "${command}" deleted successfully.`);
  else err(`Could not delete alias ${command}. Please try again.`);
};
