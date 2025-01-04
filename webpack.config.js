const path = require("path");
const LiveReloadPlugin = require("webpack-livereload-plugin");

module.exports = {
  mode: "development", // Set the mode to development
  entry: "./src/app/SearchComponent.js", // Path to your React component
  output: {
    path: path.resolve(__dirname, "public/js"), // Output directory
    filename: "bundle.js" // Output file
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Transpile .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"], // Use presets for ES6 and React
            plugins: ["babel-plugin-styled-components"]
          }
        }
      },
      {
        test: /\.module\.css$/, // Match files ending with .module.css
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]" // Scoped class naming
              }
            }
          }
        ]
      },
      {
        test: /\.css$/, // Match regular .css files (non-modules)
        exclude: /\.module\.css$/, // Exclude .module.css
        use: ["style-loader", "css-loader"] // Regular global CSS
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"] // Automatically resolve these extensions
  },
  plugins: [
    new LiveReloadPlugin({
      appendScriptTag: true // This will append the livereload <script> tag automatically into your HTML
    })
  ]
};
