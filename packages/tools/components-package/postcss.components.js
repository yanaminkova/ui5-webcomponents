const postcssImport = require('postcss-import');
const postcssCSStoESM = require('../lib/postcss-css-to-esm/index.js');
const cssnano = require('cssnano');
const fs = require("fs");

const packageName = JSON.parse(fs.readFileSync("./package.json")).name;

const scoped = process.argv[process.argv.length - 1].includes("scoped");

const toReplace = "src";
const replaceWith = scoped ? "dist/scoped" : "dist";


module.exports = {
	plugins: [
		postcssImport(),
		cssnano({
			preset: [
				'default', {
					mergeLonghand: false, // https://github.com/cssnano/cssnano/issues/675
					mergeRules: false, // https://github.com/cssnano/cssnano/issues/730
				},
			]
		}),
		postcssCSStoESM({toReplace, replaceWith, includeDefaultTheme: true, packageName}),
	]
};
