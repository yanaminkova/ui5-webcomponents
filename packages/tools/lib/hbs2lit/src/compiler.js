const HTMLLitVisitor = require("./litVisitor2");
const PartialsVisitor = require("./partialsVisitor");
const Handlebars = require("handlebars/dist/handlebars.min.js");
const includesReplacer = require("./includesReplacer");
const svgProcessor = require("./svgProcessor");

const removeWhiteSpaces = (source) => {
	return source
		.replace(/\s*\r*\n+\s*/g, " ") // Replace new lines and all whitespace between them with a space
		.replace(/\s*<\s*/g, "<") // Strip whitespace round <
		.replace(/\s*>\s*/g, ">") // Strip whitespace round >
		.replace(/}}\s+{{/g, "}}{{"); // Remove whitespace between }} and {{
};

const replaceTags = (source, scope) => {
	return source.replace(/(<\/?[a-zA-Z0-9\-]+?)-([a-zA-Z0-9]+?)([> ])/g, `$1-$2-${scope}$3`);
};

const hbs2lit = (file, scope) => {
	let sPreprocessed = includesReplacer.replace(file);

	sPreprocessed = removeWhiteSpaces(sPreprocessed);
	if (scope) {
		sPreprocessed = replaceTags(sPreprocessed, scope);
	}

	const ast = Handlebars.parse(sPreprocessed);

	const pv = new PartialsVisitor();
	const lv = new HTMLLitVisitor();

	let result = "";

	pv.accept(ast);
	pv.modify(ast);

	lv.accept(ast);

	for (let key in lv.blocks) {
		result += lv.blocks[key] + "\n";
	}

	result = svgProcessor.process(result);
	return result;
};

module.exports = hbs2lit;
