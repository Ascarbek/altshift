const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
	entry: {
		background: './src/background.js',
    content: './src/content.js',
    wrapper: './src/wrapper/index.js',
	},
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte')
		},
		extensions: ['.mjs', '.js', '.ts', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
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
            preprocess: require('svelte-preprocess')({})
					}
				}
			},
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'img',
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        type: 'javascript/auto',
        test: /manifest\.json$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      },
		]
	},
	mode: "development",
	plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/wrapper/index.html'
    }),
		new MiniCssExtractPlugin({
			filename: '[name].css'
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].[chunkhash:8].js.map'
    }),
	],
	// devtool: prod ? false: 'source-map'
	devtool: false
};
