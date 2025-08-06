const path = require('path');
const { merge } = require('webpack-merge');

/** @type {import('webpack').Configuration} */
module.exports = (config) => {
  return merge(config, {
    module: {
      rules: [] // Leave rules empty so Angular keeps its own loaders
    },
    resolve: {
      alias: {
        '@styles': path.resolve(__dirname, 'libs/styles/src/lib'),
      }
    },
    // Pass includePaths into sass-loader through Angular’s default config
    // using `sassOptions` override
    plugins: [],
  });
};
