const path = require('path');
const DashboardPlugin = require('webpack-dashboard/plugin');
const GlobImporter = require('node-sass-glob-importer');
const WebpackNotifierPlugin = require('webpack-notifier');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const babelConfig = require('./babel.config');

module.exports = ( env = 'development' ) => {

	let css_sourcemaps = false

	let active_plugins = [
		new VueLoaderPlugin(),
		new WebpackNotifierPlugin({
			title: 'Flickerbox Build Runner',
			contentImage: path.join(__dirname, 'notifier.png'),
			alwaysNotify: true,
			skipFirstNotification: false,
			excludeWarnings: false
		})
	];

	if( env === 'development' ) {
		css_sourcemaps = 'inline'
		active_plugins.push(
			new DashboardPlugin(),
		);
	}

	return {

		mode: env,

		watch: ( env === 'development' ),

		entry: [],

		output: {
			path: path.resolve(__dirname),
			filename: 'js/[name].js',
		},

		plugins: active_plugins,

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
						importer: GlobImporter()
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
				exclude: /node_modules/
			}, {
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: '../fonts/'
					}
				}]
			}],
		}
	}

}
