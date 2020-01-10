module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "browsers": ["> 0.5%", "last 2 versions", "iOS >= 8", "IE >= 10"]
                },
                "modules": "commonjs",
                "useBuiltIns" : "usage",
                "corejs": "3.0.0",
            }
        ],
    ],
    plugins: [
        '@babel/plugin-transform-object-assign',
        '@babel/plugin-transform-runtime',
        '@babel/plugin-transform-modules-commonjs',
        '@babel/plugin-transform-arrow-functions',
        '@babel/plugin-transform-async-to-generator',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-export-default-from',
        [
            '@babel/plugin-proposal-decorators', { 'legacy': true }
        ]
    ]
}
