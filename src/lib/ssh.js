'use strict';

const prompt = require('prompts');

const {
  log,
  err,
  handleError,
  validatePrompt,
} = require('./util');
const json = require('./json');
const { sshPath, defaultUser } = require('./constants');

const addCommand = async (options, commands) => {
  let command = '';
  const {
    name,
    user,
    port,
    remote,
    address,
    complete,
    identity,
  } = options;

  const errorMsg = 'You must either include a host address with "-a" or a complete ssh command (wrapped in quotes) with "-c".';

  if (complete) command = (complete.startsWith('ssh ') ? complete : `ssh ${complete}`);
  else if (!address) handleError(errorMsg);
  else {
    command = 'ssh ';
    if (identity) {
      command += '-i ';
      if (identity.includes('/')) command += `${identity} `;
      else command += `${sshPath}/${identity} `;
    }

    if (remote) command += '-R 52698:localhost:52698 ';

    command += `${user || defaultUser}@${address} `;

    if (port) command += `-p ${port} `;
  }

  command = command.slice(0, -1);

  if (complete || address) {
    log('Would you like to store this shortcut?\n');
    console.log('\n\tname:', name);
    console.log('\n\tcommand:', command, '\n');
    const { confirm } = await prompt({
      type: 'text',
      name: 'confirm',
      message: 'Press <ENTER> to confirm, or <ESCAPE> to cancel.',
      format: validatePrompt,
    });

    if (confirm) {
      commands[name] = command;
      const success = await json.write(commands);

      if (success) log(`Success! Use your new command by typing "ez-ssh ${command}"`);
      else err('Something went wrong, please try again.');
    } else log('Command not stored.');
  }
};

const deleteCommand = async (command, commands) => {
  log(`Would you like to delete the command "${command}"?\n`);

  const { confirm } = await prompt({
    type: 'text',
    name: 'confirm',
    message: 'Press <ENTER> to confirm, or <ESCAPE> to cancel.',
    format: validatePrompt,
  });

  if (confirm) json.deleteCommand(command, commands);
};

module.exports = {
  addCommand,
  deleteCommand,
};
