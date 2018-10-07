'use strict';

const util = module.exports = {};

util.log = (...args) => console.log('[INFO]', ...args);

util.err = (...args) => console.error('[ERROR]', ...args);

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
