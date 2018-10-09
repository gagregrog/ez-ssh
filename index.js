#!/usr/bin/env node

'use strict';

const main = require('./src/main');
const { options, usage, error } = require('./src/lib/cli');
const { hasArgs, handleError } = require('./src/lib/util');

const badUsage = hasArgs(options) && !options.name && !(options.list || options.wizard);
const showUsage = (options.help || ['help', 'h'].includes((options.name || '').toLowerCase()));

if (error) handleError(error.message);
else if (showUsage) console.log(usage);
else if (badUsage) handleError('You must provide a name when adding or executing an alias.');
else main(options);
