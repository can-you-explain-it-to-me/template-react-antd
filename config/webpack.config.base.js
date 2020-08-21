const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const root = path.resolve(__dirname, "../");
const srcRoot = root + "/src";

module.exports = {
	entry: {
		index: srcRoot + "/index.tsx",
	},
	output: {
		filename: "[name].bundle.js",
		path: root + "/dist",
	},
	module: {
		rules: [
			{ test: /.css$/, loader: ["style-loader", "css-loader"] },
			{ test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ },
		],
	},
	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx"],
		alias: {
			"@": srcRoot,
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: srcRoot + "/index.html",
		}),
		new Jarvis({
			port: 1337, // optional: set a port
		}),
	],
	optimization: {
		usedExports: true,
	},
	devtool: "source-map",
	devServer: {
		contentBase: root + "/dist",
	},
};
