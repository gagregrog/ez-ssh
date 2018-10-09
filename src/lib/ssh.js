'use strict';

const shell = require('shelljs');
const prompt = require('prompts');

const {
  log,
  err,
  logHelp,
  handleError,
  validatePrompt,
} = require('./util');
const json = require('./json');
const { bash, sshPath, defaultUser } = require('./constants');

const ssh = module.exports = {};

ssh.exec = (command) => shell.exec(`bash ${bash} ${command}`, { silent: true });
let required = true;

const checkRequiredAndSwitch = prev => {
  if (!prev || !required) {
    required = false;
    return null;
  }
  
  return 'text';
};

const checkRequired = () => (required ? 'text' : null);

const checkRequiredAndPrev = (prev) => ((!required || !prev) ? null : 'text');

ssh.wizard = async (commands) => {
  const questions = [
    {
      type: 'text',
      name: 'name',
      message: 'What alias would you like to use for your new shortcut?\n  Required:',
    },
    {
      type: checkRequiredAndSwitch,
      name: 'address',
      message: 'What is the address of the host machine you would like to connect to?\n  Required:',
    },
    {
      type: checkRequiredAndSwitch,
      name: 'user',
      message: 'What user would you like to login with?\n  (Press <ENTER> to use "ubuntu")',
      format: val => (val || 'ubuntu'),
    },
    {
      type: checkRequiredAndSwitch,
      name: 'useIdentity',
      message: 'Would you like to use an identity file to login?.\n  Type Y for YES, or press <ENTER> for NO.',
      format: validatePrompt(),
    },
    {
      type: checkRequiredAndPrev,
      name: 'identity',
      message: 'Provide the name of the file located in ~/.ssh, or an absolute path to the file.',
    },
    {
      type: checkRequired,
      name: 'port',
      message: 'Is there a specific port you would like to connect to?\n  Provide it here, or press <ENTER> to skip.',
      format: val => ((val && !isNaN(Number(val))) ? val : false),
    },
    {
      type: checkRequired,
      name: 'remote',
      message: 'Would you like to enable a remote connection on port 52698 for VS Code remote editing?\n  Type Y for YES, or press <ENTER> for NO.',
      format: validatePrompt(),
    },
  ];

  console.log('\n\tWelcome to the SSH Wizard!\n');
  const options = await prompt(questions);
  const { name, address, user } = options;

  if (!(name && address && user)) logHelp('Wizard Aborted!\n\n\tThere was not enough information provided to create the shortcut.\n');
  else ssh.addCommand(options, commands);
};

ssh.addCommand = async (options, commands) => {
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

  if (command.endsWith(' ')) command = command.slice(0, -1);

  if (complete || address) {
    log('Would you like to store this alias?');
    console.log('\n\talias:', name);
    console.log('\n\tcommand:', command, '\n');
    const { confirm } = await prompt({
      type: 'text',
      name: 'confirm',
      message: 'Press <ENTER> to confirm, or <ESCAPE> to cancel.',
      format: validatePrompt(true),
    });

    if (confirm) {
      commands[name] = command;
      const success = await json.write(commands);

      if (success) {
        console.log();
        log(`Success! You can use your new alias by typing "ez-ssh ${name}".\n`);
        console.log(`\tWould you like to try your new alias now?.\n`);

        const { useNow } = await prompt({
          type: 'text',
          name: 'useNow',
          message: 'Press <ENTER> to confirm, or <ESCAPE> to cancel.',
          format: validatePrompt(true),
        });

        if (useNow) ssh.exec(command);
      } else err('Something went wrong, please try again.');
    } else logHelp('Alias not stored.\n');
  }
};

ssh.deleteCommand = async (command, commands) => {
  log(`Would you like to delete the alias "${command}"?\n`);
  console.log(`\tIt is currently set as "${commands[command]}"\n`);

  const { confirm } = await prompt({
    type: 'text',
    name: 'confirm',
    message: 'Press <ENTER> to confirm, or <ESCAPE> to cancel.',
    format: validatePrompt(true),
  });

  if (confirm) json.deleteCommand(command, commands);
  else logHelp('Alias not deleted.\n');
};
