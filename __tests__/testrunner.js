const assert = require('assert');
const glob = require('glob');
const path = require('path');

// Find all test files using the glob pattern
const testFiles = glob.sync('..\\__tests__\\*.js');

// Run each test file
testFiles.forEach((file) => {
  const absolutePath = path.resolve(file);
  console.log(`Running tests in ${absolutePath}`);

  try {
    // Dynamically require and run each test file
    require(absolutePath);
    console.log(`Tests in ${absolutePath} passed successfully\n`);
  } catch (error) {
    console.error(`Tests in ${absolutePath} failed\n`, error);
    process.exit(1);
  }
});
