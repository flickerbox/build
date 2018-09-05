module.exports = {
	"presets": [
		"stage-2",		// For spread operators
		"react",
		["env", {
			"targets": {
				"browsers": ["> 0.5%", "last 2 versions", "iOS >= 8", "IE >= 10"]
			},
			"useBuiltIns": "entry",
			"debug": false
		}]
	],
	"plugins": [[
		"transform-object-assign",
		"transform-es2015-constants",
		"transform-es2015-classes",
		"transform-class",
		"transform-es2015-modules-commonjs",
		"transform-class-properties",
		{ "spec": true }
	]]
}

