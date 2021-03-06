var tagFilter = require("./lib/tag_filter");

var plugin = {
  initialize: function (argv) {
    plugin.settings.initialize(argv);
  },
  iterator: require("./lib/get_tests"),
  filters: {
    tag: tagFilter,
    tags: tagFilter,
    group: require("./lib/group_filter"),
    test: require("./lib/single_test_filter")
  },
  help: require("./lib/help"),
  settings: require("./lib/settings"),
  TestRun: require("./lib/test_run")
};

module.exports = plugin;