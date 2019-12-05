const path = require('path');
const webpack = require('webpack');
const GlobImporter = require('node-sass-glob-importer');
const WebpackNotifierPlugin = require('webpack-notifier');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const babelConfig = require('./babel.config');

module.exports = ( env = 'development' ) => {

	return {

		mode: env,

		watch: ( env === 'development' ),

		entry: [],

		output: {
			path: path.resolve(__dirname),
			filename: 'js/[name].js',
		},

		plugins: [
			new VueLoaderPlugin(),
			new WebpackNotifierPlugin({
				title: 'Flickerbox Build Runner',
				contentImage: path.join(__dirname, 'notifier.png'),
				alwaysNotify: true,
				skipFirstNotification: false,
				excludeWarnings: false
			}),
			new webpack.DefinePlugin({
				PRODUCTION: JSON.stringify(env === 'production'),
			}),
		],

		devtool: 'source-map',

		resolve: {
			alias: {
				'vue$': 'vue/dist/vue.esm.js',
				'fabric': require('@flickerbox/fabric/webpack.manifest').sassDir,
				'pacnav': require('@flickerbox/pacnav/webpack.manifest').sassDir,
			},
			extensions: ['*', '.js', '.vue', '.json'],
		},

		module: {
			preloaders: [{
				test: /\.scss$/,
				loader: 'import-glob',
			}],
			rules: [{
				test: /\.css$/,
				use: [{
					loader: 'vue-style-loader',
				}, {
					loader: 'css-loader',
				}]
			}, {
				test: /\.sass$/,
				use: [{
					loader: 'vue-style-loader',
				}, {
					loader: 'css-loader',
				}, {
					loader: 'sass-loader',
				}]
			}, {
				test: /\.scss$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].css',
						outputPath: './css',
						sourceMap: true,
					}
				}, {
					loader: 'postcss-loader',
					options: {
						config: {
							path: path.resolve(__dirname, 'postcss.config.js'),
							ctx: {
								minify: (env === 'production'),
							}
						}
					}
				}, {
					loader: 'sass-loader',
					options: {
						sourceMap: true,
						importer: GlobImporter(),
					}
				}]
			}, {
				test: /\.vue$/,
				use: [{
					loader: 'vue-loader',
					options: {
						loaders: {
							js: 'babel-loader',
							options: babelConfig,
						}
					}
				}]
			}, {
				test: /\.js$/,
				use: [{
					loader: 'babel-loader',
					options: babelConfig,
				}],
				exclude: [
					/node_modules(?!\/\@flickerbox)/,
				],
			}, {
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: './fonts'
					}
				}]
			}],
		}
	}

}
