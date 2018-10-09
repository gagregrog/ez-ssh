'use strict';

const { help } = require('./constants');

const util = module.exports = {};

util.log = (...args) => console.log('\n[INFO]', ...args);

util.err = (...args) => console.error('\n[ERROR]', ...args);

util.handleError = (...messages) => {
  messages.forEach((message) => {
    util.err(message);
  });
  console.log(help);
};

util.hasArgs = (options) => {
  let hasArgs = false;
  Object.keys(options).some((command) => {
    if (options[command]) {
      hasArgs = true;
    }

    return hasArgs;
  });

  return hasArgs;
};

util.isCalling = (options) => (Object.keys(options).length === 1 && !!options.name);

util.logHelp = (...args) => util.log(...args, help);

util.handleList = (options, commands, commandNames) => {
  if (!commandNames.length) util.logHelp('You have no saved aliases.\n');
  else {
    util.log('Your saved aliases are as follows:\n');

    if (options.verbose || options.name === 'lsv') {
      const max = commandNames.reduce((a, c) => (a > c.length ? a : c.length));
      commandNames.forEach((command) => {
        console.log(`\t${command.padEnd(max)}: ${commands[command]}`);
      });
    } else console.log(`\t${commandNames.join(', ')}`);
  }
};

util.validatePrompt = (confirmOnEnter) => (val) => {
  let confirm = true;
  val = val.toLowerCase();

  if (val === '' && !confirmOnEnter) return false;

  (['n', 'no', 'nope', 'nah', 'cancel', 'abort', 'q', 'quit', 'exit']).some((word) => {
    if (val.includes(word)) {
      confirm = false;

      return true;
    }

    return false;
  });

  return confirm;
};
