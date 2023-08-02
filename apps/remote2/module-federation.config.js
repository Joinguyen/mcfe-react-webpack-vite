module.exports = {
  name: 'remote2',
  exposes: {
    './Module': './src/remote-entry.ts',
  },
};
