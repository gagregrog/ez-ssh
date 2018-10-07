'use strict';

const util = module.exports = {};

util.log = (...args) => console.log('\n[INFO]', ...args);

util.err = (...args) => console.error('\n[ERROR]', ...args);

util.handleError = (...messages) => {
  messages.forEach((message) => {
    util.err(message);
  });
  console.log('\n\tType "ez-ssh -h" for help getting started.');
};

util.hasArgs = (options) => {
  let hasArgs = false;
  Object.keys(options).some((key) => {
    if (options[key]) {
      hasArgs = true;
    }

    return hasArgs;
  });

  return hasArgs;
};

util.isCalling = (options) => (Object.keys(options).length === 1 && !!options.key);

util.handleList = (options, keys, keyNames) => {
  if (!keyNames.length) util.log('You have no saved keys.', '\n\tType "ez-ssh -h" for help getting started.');
  else {
    util.log('Your saved keys are as follows:\n');

    if (options.verbose || options.key === 'lsv') {
      const max = keyNames.reduce((a, c) => (a > c.length ? a : c.length));
      keyNames.forEach((key) => {
        console.log(`\t${key.padEnd(max)}: ${keys[key]}`);
      });
    } else console.log(`\t${keyNames.join(', ')}`);
  }
};
