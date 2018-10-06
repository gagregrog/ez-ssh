#!/usr/bin/env node

'use strict';

const handleSSH = require('./lib/handle-ssh');
const { options, usage, error } = require('./lib/cli');
const { err, hasArgs, handleError } = require('./lib/util');

if (error) err(error);
else if (options.help || !hasArgs(options)) console.log(usage);
else if (!options.key) handleError('You must provide a keyword.');
else handleSSH(options);
