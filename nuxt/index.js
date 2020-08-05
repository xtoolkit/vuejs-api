const {resolve} = require('path');

module.exports = function nuxtChimeraModule(moduleOptions) {
  const options = Object.assign(this.options.api, moduleOptions);

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'arshen/vuejs-api.js',
    options
  });
};

module.exports.meta = require('../package.json');
