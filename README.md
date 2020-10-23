# Flickerbox Build

Basic webpack.config.js
```
module.exports = require('@flickerbox/build/webpack.config')
	.output
		.path(__dirname)
		.filename('js/[name].js')
		.end()
	.entry('css')
		.add('./src/sass/main.scss')
		.end()
	.entry('js')
		.add('./src/js/main.js')
		.end()
	.toConfig();
```
