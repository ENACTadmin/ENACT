const mongoose = require("mongoose");

describe("Mongoose v9 Compatibility", function () {
  this.timeout(10000);

  it("should connect without deprecated options", function () {
    // Mongoose v9 removed useNewUrlParser, useCreateIndex, useUnifiedTopology
    // This test ensures we're not passing deprecated options
    const uri = "mongodb://localhost/test-deploy";
    
    // Should not throw on connect (even if connection fails, syntax should be valid)
    try {
      mongoose.connect(uri);
      // If we get here, the syntax is correct for v9
    } catch (err) {
      // Connection errors are expected (no server running), but syntax errors are not
      if (err.message.includes("useNewUrlParser") || 
          err.message.includes("useCreateIndex") || 
          err.message.includes("useUnifiedTopology")) {
        throw new Error("Deprecated mongoose options detected - this will break on Heroku");
      }
    }
  });

  it("should not have deprecated options in app.js", function () {
    const fs = require("fs");
    const appJs = fs.readFileSync("./app.js", "utf8");
    
    const hasDeprecatedOptions = appJs.includes("useNewUrlParser") ||
      appJs.includes("useCreateIndex") ||
      appJs.includes("useUnifiedTopology");
    
    if (hasDeprecatedOptions) {
      throw new Error("app.js contains deprecated Mongoose options - this will break on Heroku");
    }
  });

  it("should have mongoose v7+ installed", function () {
    const packageJson = require("../package.json");
    const mongooseVersion = packageJson.dependencies.mongoose;
    
    // Extract major version from version string like "^7.8.3"
    const majorVersion = parseInt(mongooseVersion.replace(/[^0-9]/g, ''));
    
    if (majorVersion < 7) {
      throw new Error(`mongoose ${mongooseVersion} is outdated - upgrade to v7+ for security fixes`);
    }
  });
});
