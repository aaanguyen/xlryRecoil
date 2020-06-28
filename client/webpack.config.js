const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/code/main.tsx",

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },

  module: {
    rules: [
      {
        test: /\.png$/,
        use: { loader: "url-loader", options: { limit: 65536, esModule: false } },
      },
      {
        test: /\.html$/,
        use: { loader: "html-loader" },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
      chunkFilename: "styles.css",
    }),
    new HtmlWebPackPlugin({ template: "./src/index.html", filename: "./index.html" }),
  ],

  performance: { hints: false },
  watch: true,
  devtool: "source-map",
};
