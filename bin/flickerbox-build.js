#!/usr/bin/env node

'use strict';

/**
 * External requirements
 */
const commander = require('commander');

/**
 * Setup command
 */
const program = new commander.Command('flickerbox-build');
const pkg = require('../package.json');

/**
 * Internal scripts
 */
const scripts = {
	'build': require('../scripts/build.js'),
	'help': require('../scripts/help.js'),
	'version-check': require('../scripts/version-check.js'),
};

/**
 * Export main
 */
const main = module.exports = opts => {

	opts = opts || {};

	const argv = typeof opts.argv === 'undefined' ? process.argv : opts.argv;

  program.option('--config <config>', 'Path to the config file');
  program.option('--progress', 'Print compilation progress in percentage');
  program.option('--watch', 'Enter watch mode, which rebuilds on file change.');

	program.version(pkg.version);
	program.usage('[options] -- [script] [arguments]');
	program.parse(argv);

	const command = program.args[0];
  const args = program.args.slice(1);
  const env = process.env;

  if( command in scripts ) {
    scripts[command](args, env);
  } else {
    const { version, ...options } = program.opts()
    scripts.build(options, env);
  }

};

if (require.main === module) {
  main();
}
