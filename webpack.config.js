const babelConfig = require('./babel.config')
const dashboard = require('webpack-dashboard/plugin')
const globImporter = require('node-sass-glob-importer')
const ignoreAssetsPlugin = require('ignore-assets-webpack-plugin')
const notifier = require('webpack-notifier')
const path = require('path')
const vueLoader = require('vue-loader/lib/plugin')
const webpack = require('webpack')

const environment = process.env.NODE_ENV

module.exports = {

  mode: environment,

  entry: [],

  output: {
    path: path.resolve(__dirname),
    filename: 'js/[name].js',
  },

  plugins: [
    new dashboard(),
    new vueLoader(),
    new ignoreAssetsPlugin({
      ignore: ['js/css.js', 'js/css.js.map']
    }),
    new notifier({
      title: 'Flickerbox Build',
      contentImage: path.join(__dirname, 'notifier.png'),
      alwaysNotify: true,
      skipFirstNotification: false,
      excludeWarnings: false,
    }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify('production' === environment),
    }),
  ],

  devtool: ( 'production' === environment ? '' : 'source-map' ),

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'fabric': require('@flickerbox/fabric/webpack.manifest').sassDir,
      'pacnav': require('@flickerbox/pacnav/webpack.manifest').sassDir,
    },
    extensions: ['*', '.js', '.vue', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'vue-style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].css',
              outputPath: './css',
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.resolve(__dirname, 'postcss.config.js'),
                ctx: {
                  minify: ('production' === environment),
                }
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              precision: 10,
              sourceMap: ('development' === environment),
              sassOptions: {
                importer: globImporter()
              }
            }
          },
        ]
      },
      {
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
      },
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: babelConfig,
        }],
        exclude: [
          /node_modules(?!\/\@flickerbox)/,
        ],
      },
      {
        test: /\.svg$/,
        loader: 'vue-svg-loader',
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: './fonts'
          }
        }]
      },
    ]
  },

};
