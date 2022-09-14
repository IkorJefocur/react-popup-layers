const
	MiniCssExtract = require('mini-css-extract-plugin'),
	Html = require('html-webpack-plugin');

module.exports = {

	mode: 'development',
	devtool: 'inline-source-map',

	output: {
		filename: 'main.js'
	},

	plugins: [
		new MiniCssExtract(),
		new Html()
	],

	module: {
		rules: [
			{
				test: /\.tsx$/,
				use: [{
					loader: 'ts-loader',
					options: {
						onlyCompileBundledFiles: true
					}
				}]
			},
			{
				test: /\.css$/,
				use: [MiniCssExtract.loader, 'css-loader']
			}
		]
	}

};