var _ = require('lodash');
var fs = require('fs');
var path = require("path");
var spawnSync = require('spawn-sync');
var Locator = require("./locator");
var mochaSettings = require("./settings");
var reporter = path.resolve(__dirname, 'test_capture.js');

module.exports = function(settings) {
  var OUTPUT_PATH = path.resolve(settings.tempDir, 'get_mocha_tests.json');
  var cmd = './node_modules/.bin/mocha';
  var args = ['--reporter', reporter];

  if (mochaSettings.mochaOpts) {
    args.push('--opts', mochaSettings.mochaOpts);
  }

  args = args.concat(mochaSettings.mochaTestFolders);
  var env = _.extend({}, process.env, {MOCHA_CAPTURE_PATH: OUTPUT_PATH});
  var capture = spawnSync(cmd, args, {env: env});

  if (capture.status !== 0 || capture.stderr.toString()) {
    console.error('Could not capture mocha tests. To debug, run the following command:\nMOCHA_CAPTURE_PATH=%s %s %s', OUTPUT_PATH, cmd, args.join(' '));
    process.exit(1);
  }

  var tests = fs.readFileSync(OUTPUT_PATH, 'utf-8');
  fs.unlinkSync(OUTPUT_PATH);

  tests = JSON.parse(tests).map(function(t) {
    return new Locator(t.fullTitle, t.file, t.pending, t.title);
  });

  return tests;
};
