const
	prefix = require('postcss-class-prefix'),
	transformVars = require('postcss-custom-properties-transformer'),
	namespace = require('./src/cn/namespace').default;

module.exports = {
	plugins: [
		prefix(namespace),
		transformVars({
			transformer: ({property}) => `${namespace}${property}`
		})
	]
};