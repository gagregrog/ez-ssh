'use strict';

const getUsage = require('command-line-usage');
const commandLineArgs = require('command-line-args');

const makeTableRow = (data, i) => {
  return [
    { a: `${i + 1}. ${data[0]}` },
    { b: `Input:  $ ez-ssh ${data[1]}` },
    { b: `Result: ssh ${data[2]}` },
    { b: `Usage:  $ ez-ssh ${data[3]}\n\n` },
  ];
};

const makeTable = (rows) => {
  let formattedRows = [];
  rows.forEach((row, i) => {
    formattedRows = [...formattedRows, ...makeTableRow(row, i)];
  });

  return formattedRows;
};

const cli = module.exports = {
  usage: null,
  options: null,
  error: null,
};

const optionList = [
  {
    name: 'key',
    alias: 'k',
    type: String,
    defaultOption: true,
    description: '{rgb(255, 0, 0) Required} The keyword used to identify the command.',
  },
  {
    name: 'address',
    alias: 'a',
    type: String,
    description: 'The address of the host machine to ssh into.',
  },
  {
    name: 'identity',
    alias: 'i',
    type: String,
    description: 'The name of a PEM file stored in ~/.ssh, or an absolute path to the file.',
  },
  {
    name: 'user',
    alias: 'u',
    type: String,
    default: 'ubuntu',
    description: 'The name of the user to login with. Defaults to ubuntu.',
  },
  {
    name: 'port',
    alias: 'p',
    type: String,
    description: 'A specific port to ssh into.',
  },
  {
    name: 'remote',
    alias: 'r',
    type: Boolean,
    default: false,
    description: 'Whether to add support for Remote VSCode editor on port 52698.',
  },
  {
    name: 'complete',
    alias: 'c',
    type: String,
    description: 'A complete ssh command to store (excluding the initial "ssh") wrapped in quotes.',
  },
  {
    name: 'delete',
    alias: 'd',
    type: Boolean,
    description: 'Delete a stored key.',
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Display this usage guide.',
  },
];

const examples = makeTable([
  [
    'Basic',
    'ec2 -i my_aws_pem.pem -a ec2-14-125-321-552.compute-1.amazonaws.com',
    '-i ~/.ssh/my_aws_pem.pem ubuntu@ec2-14-125-321-552.compute-1.amazonaws.com',
    'ec2',
  ],
  [
    'Local',
    'pi -a raspberryPi.local -u pi -p 1776',
    'pi@raspberryPi.local -p 1776',
    'pi',
  ],
  [
    'Remote',
    'drop -a 203.0.113.0 -u root -r',
    '-R 52698:localhost:52698 root@203.0.113.0',
    'drop',
  ],
  [
    'Custom',
    'list -c "penguin.example.net ls /usr/share/doc"',
    'penguin.example.net ls /usr/share/doc',
    'list',
  ],
]);

const sections = [
  {
    header: 'ez-ssh',
    content: 'Super-simple command line interface for handling ssh into a remote machine.',
  },
  {
    header: 'Options',
    optionList,
  },
  {
    header: 'Examples',
    content: examples.concat([
      { a: `${examples.length / 4 + 1}. Delete` },
      { b: 'Input:  $ ez-ssh list -d' },
      { b: 'Result: The "list" command has been deleted.' },
    ]),
  },
  {
    content: 'Project home: {underline https://github.com/RobertMcReed/ez-ssh/}',
  },
];

try {
  cli.usage = getUsage(sections);
  cli.options = commandLineArgs(optionList);
} catch (e) {
  cli.error = e;
}
