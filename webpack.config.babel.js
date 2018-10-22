import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const isProd = process.env.NODE_ENV === 'production';

export default (function makeWebpackConfig() {
	const config = {};

	/**
	 * Configuration begins here
	 * Reference: https://webpack.js.org/configuration/
	 */

	// Reference: https://webpack.js.org/concepts/mode/
	config.mode = 'none';

	// Cache generated modules and chunks to improve performance for multiple incremental builds.
	// Reference: https://webpack.js.org/configuration/other-options/#cache
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
		chunkFilename: isProd
			? 'dist/[name].[chunkhash].js'
			: 'dist/[name].bundle.js'
	};

	// Choose a developer tool to enhance debugging.
	// Reference: https://webpack.js.org/configuration/devtool/#devtool
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
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						// By default Babel is injecting helpers into each file that requires it.
						// Require the babel runtime as a separate module to avoid the duplication.
						// Reference: https://github.com/babel/babel-loader#babel-is-injecting-helpers-into-each-file-and-bloating-my-code
						plugins: ['@babel/plugin-transform-runtime']
					}
				}
			},
			{
				test: /\.s?css$/,
				use: [
					// MiniCssExtractPlugin
					// https://github.com/webpack-contrib/mini-css-extract-plugin
					// STYLE LOADER
					// Reference: https://github.com/webpack-contrib/style-loader
					isProd ? MiniCssExtractPlugin.loader : 'style-loader',
					// CSS LOADER
					// Reference: https://github.com/webpack-contrib/css-loader
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1
							// Enable CSS minification, this option has no connection to config.devtool
							// Reference: https://github.com/webpack/webpack/issues/189
							// minimize: true,
							// sourceMap: true
						}
					},
					// SASS LOADER
					// Reference: https://github.com/webpack-contrib/sass-loader
					{
						loader: 'sass-loader'
					},
					// POSTCSS LOADER
					// Reference: https://github.com/postcss/postcss-loader
					{
						loader: 'postcss-loader'
					}
				]
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
	 * Reference: https://webpack.js.org/configuration/plugins/
	 * List: https://webpack.js.org/plugins/
	 * More: https://github.com/webpack-contrib/awesome-webpack#webpack-plugins
	 */

	config.plugins = [];

	// HtmlWebpackPlugin
	// Injects bundles in your main file instead of wiring all manually.
	// Reference: https://github.com/jantimon/html-webpack-plugin
	config.plugins.push(
		new HtmlWebpackPlugin({
			filename: 'index.html',
			inject: 'head'
		})
	);

	// MiniCssExtractPlugin
	// This plugin extracts CSS into separate files.
	// It creates a CSS file per JS file which contains CSS. It supports On-Demand-Loading of CSS and SourceMaps.
	// Reference: https://github.com/webpack-contrib/mini-css-extract-plugin
	config.plugins.push(
		new MiniCssExtractPlugin({
			filename: isProd ? '[name].[hash].css' : '[name].css',
			chunkFilename: isProd ? '[id].[hash].css' : '[id].css'
		})
	);

	// Automatically move all modules defined outside of application directory to vendor bundle.
	// If you are using more complicated project structure, consider to specify common chunks manually.
	// Reference: https://webpack.js.org/plugins/split-chunks-plugin/
	// Migration questions: https://stackoverflow.com/questions/49017682/webpack-4-migration-commonschunkplugin
	config.optimization = {
		splitChunks: {
			cacheGroups: {
				vendor: {
					name: 'vendor',
					chunks: (chunk) => chunk.name == 'dist/app',
					reuseExistingChunk: true,
					priority: 1,
					test: (module) => /[\\/]node_modules[\\/]/.test(module.context),
					minChunks: 1,
					minSize: 0
				}
			}
		}
	};

	if (isProd) {
		// Reference: https://webpack.js.org/configuration/optimization/#optimization-minimize
		config.optimization.minimize = true;
	}

	// Dev server configuration
	// Reference: https://webpack.js.org/configuration/dev-server/#devserver
	config.devServer = {
		contentBase: config.output.path,
		compress: true,
		port: 3000
	};

	return config;
})();
