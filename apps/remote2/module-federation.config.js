const { dependencies } = require('./package.json');
module.exports = {
  name: 'remote2',
  exposes: {
    './Module': './src/remote-entry.ts',
  },
  shared: {
    ...dependencies
  }
};
