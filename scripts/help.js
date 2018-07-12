module.exports = ( args, env ) => {

	console.log('Available Commands:\n');
	
	console.log('----------\n');
	console.log('- prod(uction): production build, minifies css/js, removes and deletes sourcemaps');
	console.log('- dev(elopment): development build, adds sourcemaps, js is uncompressed, and watches for source file changes for continuous rebuild');
	console.log('- dev(elopment)-dashboard: run development build inside webpack dashboard');
	console.log('- watch: alias for dev');
	console.log('- version-check: shows build, node, and npm versions\n');
	console.log('----------\n');

}