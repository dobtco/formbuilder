When updating code, make sure to change the file in src/deep-model.js; NOT the files in `distribution`.

In pull requests, don't update the distribution files; this will be done before merging into master and creating a release.

#Running tests
Please make sure all tests pass before submitting pull requests.

To run tests, open the test/index.html file in a browser. You can now make changes to src/deep-model.js and reload the page to run tests.

Before submitting, you should build the distribution files (see below) and run test/distribution.html to double check everything is still OK.
