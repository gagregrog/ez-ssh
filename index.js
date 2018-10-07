#!/usr/bin/env node

'use strict';

const main = require('./src/main');
const { options, usage, error } = require('./src/lib/cli');
const { err, hasArgs, handleError } = require('./src/lib/util');

if (error) err(error);
else if (options.help || !hasArgs(options)) console.log(usage);
else if (!(options.key || options.list)) handleError('You must provide a keyword when adding or running a command.');
else main(options);
