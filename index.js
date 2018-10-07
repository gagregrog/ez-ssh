#!/usr/bin/env node

'use strict';

const main = require('./src/main');
const { options, usage, error } = require('./src/lib/cli');
const { hasArgs, handleError } = require('./src/lib/util');

if (error) handleError(error.message);
else if (options.help || !hasArgs(options) || options.key === 'help') console.log(usage);
else if (!(options.key || options.list)) handleError('You must provide a keyword when adding or running a command.');
else main(options);
