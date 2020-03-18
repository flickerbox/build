const path = require('path');
const webpack = require('webpack');
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
			rules: [{
				test: /\.css$/,
				use: [{
					loader: 'vue-style-loader',
				}, {
					loader: 'css-loader',
				}]
			}, {
				test: /\.s[ac]ss$/,
				loader: 'import-glob-loader',
				enforce: 'pre',
			}, {
				test: /\.s[ac]ss$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].css',
						outputPath: './css',
						sourceMap: true,
					},
				}, {
					loader: 'postcss-loader',
					options: {
						config: {
							path: path.resolve(__dirname, 'postcss.config.js'),
							ctx: {
								minify: (env === 'production'),
							},
						},
					},
				}, {
					loader: 'sass-loader',
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
				test: /\.svg$/,
				use: [
					{
						loader: 'babel-loader',
						options: babelConfig,
					},
					{
						loader: 'vue-svg-loader',
					},
				]
			}, {
				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
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
