'use strict';

const shell = require('shelljs');
const ssh = require('./lib/ssh');
const json = require('./lib/json');
const util = require('./lib/util');

const main = async (options) => {
  const commands = await json.read();

  if (!commands) return; // read error in json.read()

  const commandNames = Object.keys(commands);
  const numCommands = commandNames.length;
  const isCalling = util.isCalling(options);
  const command = commands[options.name];
  const list = (['ls', 'lsv'].includes(options.name) || options.list || !options.name);

  if (options.wizard) ssh.wizard(commands);
  else if (list) util.handleList(options, commands, commandNames);
  else if (isCalling && command) ssh.exec(command); // command exists, execute it
  else if (isCalling && numCommands) { // command doesn't exists, but commands do
    util.err(`Alias not found: "${options.name}"`);
    util.logHelp(`Saved aliases: ${commandNames.join(', ')}\n`); 
  } else if (isCalling) util.handleError('You do not have any saved aliases.'); // no commands
  else if (command && !options.delete) { // command exists but they aren't calling or deleting
    util.handleError(
      `The alias "${options.name}" already exists.`, 
      `Either execute your call again with a different alias, or delete the existing alias with "ez-ssh ${options.name} -d"`
    );
  } else if (command) ssh.deleteCommand(options.name, commands); // deleting a command
  else if (options.delete) util.handleError(`The alias "${options.name}" does not exist, and therefore cannot be deleted.`);
  else ssh.addCommand(options, commands);
};

module.exports = main;
