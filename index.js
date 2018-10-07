#!/usr/bin/env node

'use strict';

const main = require('./src/main');
const { options, usage, error } = require('./src/lib/cli');
const { hasArgs, handleError } = require('./src/lib/util');

if (error) handleError(error.message);
else if (options.help || !hasArgs(options) || options.name === 'help') console.log(usage);
else if (!(options.name || options.list)) handleError('You must provide a name when adding or running a command.');
else main(options);
