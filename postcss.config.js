module.exports = ({file, options, env}) => ({
	config: {
		// Reference: https://github.com/postcss/postcss-loader#context-ctx
		ctx: {
			// Reference: https://github.com/postcss/autoprefixer
			autoprefixer: {
				browsers: 'last 4 version'
			}
		}
	},
	sourceMap: true,
	plugins: [
		// Reference: https://github.com/postcss/postcss-loader#stylelint
		require('stylelint')(),
		// Reference: https://github.com/postcss/autoprefixer
		require('autoprefixer')()
	]
})
