module.exports = {
  name: 'remote1',
  exposes: {
    './Module': './src/remote-entry.ts',
  },
};
