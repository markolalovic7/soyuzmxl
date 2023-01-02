const path = require("path");

module.exports = {
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["babel-preset-es2015"],
          },
        },
      },
    ],
  },
  output: {
    filename: "betlib.js",
    library: "betlib",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist"),
  },
};
