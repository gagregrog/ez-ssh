'use strict';

const shell = require('shelljs');
const ssh = require('./lib/ssh');
const json = require('./lib/json');
const util = require('./lib/util');

const main = async (options) => {
  const commands = await json.read();

  if (!commands) return;

  const commandNames = Object.keys(commands);
  const numCommands = commandNames.length;
  const isCalling = util.isCalling(options);
  const command = commands[options.name];
  const list = (['ls', 'lsv'].includes(options.name) || options.list);

  if (list) util.handleList(options, commands, commandNames);
  else if (isCalling && command) shell.exec(command); // command exists, execute it
  else if (isCalling && numCommands) { // command doesn't exists, but commands do
    util.err(`Command not found: "${options.name}"`);
    util.logHelp(`Saved commands: ${commandNames.join(', ')}\n`); 
  } else if (isCalling) util.handleError('You do not have any saved commands.'); // no commands
  else if (command && !options.delete) { // command exists but they aren't calling or deleting
    util.handleError(
      `The command "${options.name}" already exists.`, 
      `Either execute your call again with a different name, or delete the existing command with "ez-ssh ${options.name} -d"`
    );
  } else if (command) ssh.deleteCommand(options.name, commands); // deleting a command
  else if (options.delete) util.handleError(`The command "${options.name}" does not exist, and therefore cannot be deleted.`);
  else ssh.addCommand(options, commands);
};

module.exports = main;
