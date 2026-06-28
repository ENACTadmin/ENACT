const fs = require("fs");
const path = require("path");

describe("Heroku Deployment Checks", function () {
  this.timeout(10000);

  it("should have a Procfile", function () {
    const procfilePath = path.join(__dirname, "..", "Procfile");
    if (!fs.existsSync(procfilePath)) {
      throw new Error("Procfile missing - Heroku needs this to know how to run the app");
    }
    
    const procfile = fs.readFileSync(procfilePath, "utf8");
    if (!procfile.includes("node ./bin/www") && !procfile.includes("node bin/www")) {
      throw new Error("Procfile should use 'node ./bin/www' to start the server");
    }
  });

  it("should not have husky in prepare script", function () {
    const packageJson = require("../package.json");
    
    if (packageJson.scripts.prepare === "husky") {
      throw new Error("package.json has 'prepare': 'husky' - this will fail on Heroku build");
    }
  });

  it("should have react-router-dom installed", function () {
    const packageJson = require("../package.json");
    
    if (!packageJson.dependencies["react-router-dom"]) {
      throw new Error("react-router-dom missing - React SPA will not work");
    }
  });

  it("should have webpack config with multiple entry points", function () {
    const webpackConfigPath = path.join(__dirname, "..", "webpack.config.js");
    if (!fs.existsSync(webpackConfigPath)) {
      throw new Error("webpack.config.js missing");
    }
    
    const webpackConfig = fs.readFileSync(webpackConfigPath, "utf8");
    if (!webpackConfig.includes("entry: {") || !webpackConfig.includes("main:")) {
      throw new Error("webpack.config.js missing React SPA entry point");
    }
  });

  it("should have react-app.ejs template", function () {
    const reactAppPath = path.join(__dirname, "..", "views", "react-app.ejs");
    if (!fs.existsSync(reactAppPath)) {
      throw new Error("views/react-app.ejs missing - React SPA shell route will fail");
    }
  });

  it("should not have merge conflicts in package.json", function () {
    const packageJsonPath = path.join(__dirname, "..", "package.json");
    const content = fs.readFileSync(packageJsonPath, "utf8");
    
    if (content.includes("<<<<<<<") || content.includes("=======") || content.includes(">>>>>>>")) {
      throw new Error("package.json has merge conflicts - fix before deploying");
    }
  });
});
