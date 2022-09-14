const
	{src, dest, series, parallel} = require('gulp'),
	filter = require('gulp-filter'),
	typescript = require('gulp-typescript').createProject('tsconfig.json'),
	babel = require('gulp-babel'),
	postcss = require('gulp-postcss'),
	sass = require('gulp-sass')(require('sass')),
	webpack = require('webpack-stream');

const srcPath = (...extensions) => extensions.map(ext => `./src/**/*.${ext}`);

const js = () => {
	const jsFilter = filter(srcPath('js', 'jsx'), {restore: true});
	return src(srcPath('js', 'ts', 'jsx', 'tsx'))
		.pipe(typescript())
		.pipe(jsFilter)
		.pipe(babel())
		.pipe(jsFilter.restore)
		.pipe(dest('./dist'));
};

const css = () => src(srcPath('sass', 'scss'))
	.pipe(sass())
	.pipe(postcss())
	.pipe(dest('./dist'));

const example = () => src('./example/index.tsx')
	.pipe(webpack(require('./example/webpack.config')))
	.pipe(dest('./example/dist'));

module.exports = {
	default: parallel(js, css),
	test: series(example)
};