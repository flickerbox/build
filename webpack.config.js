const path = require('path');
const babelConfig = require('./babel.config');

const Dashboard = require('webpack-dashboard/plugin');
const IgnoreAssetsPlugin = require('ignore-assets-webpack-plugin');
const Notifier = require('webpack-notifier');
const VueLoader = require('vue-loader/lib/plugin');
const Webpack = require('webpack');

const environment = process.env.NODE_ENV;

module.exports = {

  mode: environment,

  entry: [],

  output: {
    path: path.resolve(__dirname),
    filename: 'js/[name].js',
  },

  plugins: [
    new Dashboard(),
    new VueLoader(),
    new IgnoreAssetsPlugin({
      ignore: ['js/css.js', 'js/css.js.map']
    }),
    new Notifier({
      title: 'Flickerbox Build',
      contentImage: path.join(__dirname, 'icon.png'),
      alwaysNotify: true,
      skipFirstNotification: false,
      excludeWarnings: false,
    }),
    new Webpack.DefinePlugin({
      PRODUCTION: JSON.stringify('production' === environment),
    }),
  ],

  devtool: ( 'production' === environment ? '' : 'source-map' ),

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    },
    extensions: ['*', '.js', '.json', '.jsx', '.vue'],
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'vue-style-loader' },
          { loader: 'css-loader', options: { url: false } }
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
              implementation: require('sass'),
              sourceMap: ('development' === environment),
              sassOptions: {
                precision: 10,
              }
            }
          },
          {
            loader: 'import-glob-loader',
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
        test: /\.jsx?$/,
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
        options: {
          svgo: false,
        },
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
    ],
  },

};
