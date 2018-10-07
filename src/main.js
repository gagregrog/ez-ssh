'use strict';

const shell = require('shelljs');
const json = require('./lib/json');
const util = require('./lib/util');
const handleSSH = require('./lib/ssh');

const main = async (options) => {
  const keys = await json.read();

  if (!keys) return;

  const keyNames = Object.keys(keys);
  const numKeys = keyNames.length;
  const isCalling = util.isCalling(options);
  const command = keys[options.key];
  const list = (['ls', 'lsv'].includes(options.key) || options.list);

  if (list) util.handleList(options, keys, keyNames);
  else if (isCalling && command) shell.exec(command); // command exists, execute it
  else if (isCalling && numKeys) { // command doesn't exists, but commands do
    util.err('Command not found:', options.key);
    util.info(`Saved keys: ${keyNames.join(', ')}`); 
  } else if (isCalling) util.handleError('You do not have any saved keys.'); // no commands
  else if (command && !options.delete) { // command exists but they aren't calling or deleting
    util.handleError(
      `The key "${options.key}" already exists.`, 
      `Either run the command again with a different keyword, or delete the existing command with "ez-ssh ${options.key} -d"`
    );
  } else if (command) json.deleteCommand(keys, options.key); // deleting a command
  else if (options.delete) util.handleError(`The key "${options.key}" does not exist, and therefore cannot be deleted.`);
  else handleSSH(options, keys);
};

module.exports = main;
