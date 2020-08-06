const postcss = require('postcss');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const slash = require('slash');

const proccessCSS = css => {
	css = css.replace(/\.sapThemeMeta[\s\S]*?:root/, ":root");
	css = css.replace(/\.background-image.*{.*}/, "");
	css = css.replace(/\.sapContrast[ ]*:root[\s\S]*?}/, "");
	css = css.replace(/--sapFontUrl.*\);?/, "");
	return css;
};

module.exports = postcss.plugin('add css to JSON transform plugin', function (opts) {
	opts = opts || {};

	return function (root) {
		let css = root.toString();
		css = proccessCSS(css);

		const targetFile = slash(root.source.input.from).replace(`/${opts.toReplace}/`, `/${opts.replaceWith}/generated/assets/`);
		mkdirp.sync(path.dirname(targetFile));

		const filePath = `${targetFile}.json`;
		fs.writeFileSync(filePath, JSON.stringify({_: css}));
	}
});
