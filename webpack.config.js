'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isProd = process.env.NODE_ENV === 'production';

module.exports = (function makeWebpackConfig() {
	var config = {};

	/**
	 * Configuration begins here
	 * Reference: http://webpack.github.io/docs/configuration.html
	 */

	// Cache generated modules and chunks to improve performance for multiple incremental builds.
	// Reference: http://webpack.github.io/docs/configuration.html#cache
	config.cache = true;

	// Mapping entry point
	// More: https://github.com/webpack/webpack/issues/1189
	config.entry = {
		// This will map entry point to destination path related to output.path
		'dist/app': './src/app/app.js'
	};

	// Options affecting the output of the compilation.
	// Reference: http://webpack.github.io/docs/configuration.html#output
	// Additional notes:
	// http://webpack.github.io/docs/long-term-caching.html
	// https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95
	config.output = {
		path: path.resolve(__dirname, 'dist'),
		publicPath: './',
		filename: isProd ? '[name].[chunkhash].js' : '[name].bundle.js',
		// This is probably a bug, since chunks doesn't respect entry mapping in config
		chunkFilename: isProd ? 'dist/[name].[chunkhash].js' : 'dist/[name].bundle.js'
	};

	// Choose a developer tool to enhance debugging.
	// Reference: http://webpack.github.io/docs/configuration.html#devtool
	config.devtool = 'source-map';

	/**
	 * Loaders definition
	 * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
	 * List: http://webpack.github.io/docs/list-of-loaders.html
	 * This handles most of the magic responsible for converting modules
	 */

	config.module = {
		rules: [
			{
				// JS LOADER
				// Reference: https://github.com/babel/babel-loader
				// Transpile .js files using babel-loader (compile ES6 and ES7 into ES5 code)
				test: /\.js$/,
				exclude: /node_modules/,
				// We may use ng-annotate module later
				// Reference: https://github.com/jeffling/ng-annotate-webpack-plugin
				loader: 'babel-loader',
				options: {
					// By default Babel is injecting helpers into each file that requires it.
					// Require the babel runtime as a separate module to avoid the duplication.
					// Reference: https://github.com/babel/babel-loader#babel-is-injecting-helpers-into-each-file-and-bloating-my-code
					plugins: ['transform-runtime']
				}
			},
			{
				test: /\.scss$/,
				use: [
					// STYLE LOADER
					// Reference: https://github.com/webpack-contrib/style-loader
					'style-loader',
					// CSS LOADER
					// Reference: https://github.com/webpack-contrib/css-loader
					'css-loader',
					// SASS LOADER
					// Reference: https://github.com/webpack-contrib/sass-loader
					'sass-loader'
				]
			},
			{
				test: /\.css$/,
				// STYLE LOADER
				// Reference: https://github.com/webpack-contrib/style-loader
				// CSS LOADER
				// Reference: https://github.com/webpack-contrib/css-loader
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader?sourceMap'
				})
			},
			{
				// HTML LOADER
				// Reference: https://github.com/webpack/raw-loader
				// Allow loading html through js
				test: /\.html$/,
				exclude: /node_modules/,
				loader: 'raw-loader'
			}
		]
	};

	/**
	 * Add additional plugins to the compiler
	 * Reference: http://webpack.github.io/docs/configuration.html#plugins
	 * List: http://webpack.github.io/docs/list-of-plugins.html
	 */

	config.plugins = [];

	// HtmlWebpackPlugin
	// Injects bundles in your main file instead of wiring all manually.
	// Reference: https://github.com/ampedandwired/html-webpack-plugin
	config.plugins.push(
		new HtmlWebpackPlugin({
			filename: 'index.html',
			inject: 'head'
		})
	);

	// ExtractTextPlugin
	//
	// Reference: https://github.com/webpack-contrib/extract-text-webpack-plugin/blob/webpack-1/README.md
	config.plugins.push(
		new ExtractTextPlugin('style.css')
	);

	// Automatically move all modules defined outside of application directory to vendor bundle.
	// If you are using more complicated project structure, consider to specify common chunks manually.
	// Reference: http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
	config.plugins.push(
		new webpack.optimize.CommonsChunkPlugin({
			// Destination path (entry config) mapping is also needed here
			name: 'dist/vendor',
			minChunks: function (module, count) {
				return module.resource && (
					module.resource.indexOf(path.resolve(__dirname, 'src', 'app')) === -1
				);
			}
		})
	);

	if (isProd) {
		config.plugins.push(
			// http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
			new webpack.NoErrorsPlugin(),
			// Minimize all JavaScript output of chunks. Loaders are switched into minimizing mode.
			// Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
			new webpack.optimize.UglifyJsPlugin({
				mangle: false
			})
		);
	}

	return config;
}());
