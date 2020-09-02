const path = require('path');

const Config = require('webpack-chain');
const Webpack = require('webpack');

const environment = process.env.NODE_ENV;
const config = new Config();

if ('production' === environment) {
	config.devtool('source-map');
}

config.mode(environment);

config.output
	.path(path.resolve(__dirname))
	.filename('js/[name].js');

config.resolve.alias
	.set('vue$','vue/dist/vue.esm.js');

config.resolve.extensions
	.add('*')
	.add('.js')
	.add('.json')
	.add('.jsx')
	.add('.vue');

config.optimization
	.usedExports(true);

config.plugin('vue')
	.use(require('vue-loader/lib/plugin'));

config.plugin('ignore-assets')
	.use(require('ignore-assets-webpack-plugin'), [{
		ignore: [
			'js/css.js',
			'js/css.js.map',
		],
	}]);

config.plugin('notifier')
	.use(require('webpack-notifier'), [{
		title: 'Flickerbox Build',
		contentImage: path.join(__dirname, 'icon.png'),
		alwaysNotify: true,
		skipFirstNotification: false,
		excludeWarnings: false,
	}]);

config.plugin('environment')
	.use(Webpack.DefinePlugin, [{
		PRODUCTION: JSON.stringify('production' === environment),
	}]);

config.module.rule('css')
	.test(/\.css$/)
	.use('vue-style-loader')
		.loader('vue-style-loader')
		.end()
	.use('css-loader')
		.loader('css-loader')
		.options({
			url: false,
		})
		.end();

config.module.rule('scss')
	.test(/\.s[ac]ss$/)
	.use('file-loader')
		.loader('file-loader')
		.options({
			name: '[name].css',
			outputPath: './css',
			sourceMap: true,
		})
		.end()
	.use('postcss-loader')
		.loader('postcss-loader')
		.options({
			config: {
				path: path.resolve(__dirname, 'postcss.config.js'),
				ctx: { minify: ('production' === environment) },
			},
		})
		.end()
	.use('sass-loader')
		.loader('sass-loader')
		.options({
			implementation: require('sass'),
			sourceMap: ('development' === environment),
			sassOptions: {
        importer: require('node-sass-glob-importer')(),
        precision: 10,
      },
		})
		.end();

config.module.rule('vue')
	.test(/\.vue$/)
	.use('vue-loader')
		.loader('vue-loader')
		.options({
            loaders: {
				js: 'babel-loader',
				options: require('./babel.config'),
            },
        })
		.end();

config.module.rule('jsx')
	.test(/\.jsx?$/)
	.exclude
		.add(/node_modules(?!\/\@flickerbox)/)
		.end()
	.use('babel-loader')
		.loader('babel-loader')
		.options(require('./babel.config'))
		.end();

config.module.rule('svg')
	.test(/\.svg?$/)
	.exclude
		.add(/node_modules(?!\/\@flickerbox)/)
		.end()
	.use('vue-svg-loader')
		.loader('vue-svg-loader')
		.options({ svgo: false })
		.end();

config.module.rule('font')
	.test(/\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/)
	.use('file-loader')
		.loader('file-loader')
		.options({
			name: '[name].[ext]',
            outputPath: './fonts',
		})
		.end();

module.exports = config;
