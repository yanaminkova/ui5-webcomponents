const postcssImport = require('postcss-import');
const combineSelectors = require('postcss-combine-duplicated-selectors');
const postcssCSStoJSON = require('../lib/postcss-css-to-json/index.js');
const postcssCSStoESM = require('../lib/postcss-css-to-esm/index.js');
const cssnano = require('cssnano');

const scoped = process.argv[process.argv.length - 1].includes("scoped");

const toReplace = "src";
const replaceWith = scoped ? "dist/scoped" : "dist";

module.exports = {
	plugins: [
		postcssImport(),
		combineSelectors({
			removeDuplicatedProperties: true
		}),
		cssnano({
			preset: [
				'default', {
					mergeLonghand: false, // https://github.com/cssnano/cssnano/issues/675
				},
			]
		},),
		postcssCSStoJSON({toReplace, replaceWith}),
		postcssCSStoESM({toReplace, replaceWith}),
	]
};
