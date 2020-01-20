const { exec } = require('child_process');
const pkg = require('../package.json');

module.exports = ( args, env ) => {

	exec(`node -v`, ( err, stdout, stderr ) => {

		let nodeVersion = stdout.trim();

		if( nodeVersion.slice(0, 1) == 'v' ) {
			nodeVersion = nodeVersion.slice(1);
		}

		exec(`npm -v`, ( err, stdout, stderr ) => {

			let npmVersion = stdout.trim();

			if( npmVersion.slice(0, 1) == 'v' ) {
				npmVersion = npmVersion.slice(1);
			}

			console.log('Version Check Results:\n');

			console.log('----------\n');
			console.log(`Build Version: ${pkg.version}`);
			console.log(`Node Version (Recommended ${pkg.engines.node}): ${nodeVersion}`);
			console.log(`NPM Version (Recommended ${pkg.engines.npm}): ${npmVersion}\n`);
			console.log('----------\n');

		});

	});

}