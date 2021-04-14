const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const build = process.env.NODE_ENV === 'build';
const dev = process.env.NODE_ENV === 'dev';

module.exports = {
  entry: {
    ...(build
      ? {
        background: './src/background.js',
        content: './src/content.js',
      }
      : {}),
    ...(dev
      ? {
        wrapper: './src/wrapper/index.js',
      }
      : {}),
  },
  devServer: {
    host: '0.0.0.0',
    // contentBase: 'public',
    historyApiFallback: true,
    compress: true,
    port: 8080,
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte'),
    },
    extensions: ['.mjs', '.js', '.ts', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    chunkFilename: '[name].[id].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: false,
            preprocess: require('svelte-preprocess')({}),
          },
        },
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'img',
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        type: 'javascript/auto',
        test: /manifest\.json$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  mode: 'development',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/wrapper/index.html',
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map',
    }),
  ],
  // devtool: prod ? false: 'source-map'
  devtool: false,
};
