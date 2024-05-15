const path = require('path');

module.exports = {
  entry: './src/app/SearchComponent.js', // Path to your React component
  output: {
    path: path.resolve(__dirname, 'public/js'), // Output directory
    filename: 'bundle.js' // Output file
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Transpile .js and .jsx files
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env', '@babel/preset-react'] // Use presets for ES6 and React
            }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'] // Automatically resolve these extensions
  }
};
