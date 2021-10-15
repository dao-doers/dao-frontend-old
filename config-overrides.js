/* config-overrides.js */

module.exports = function override(config, env) {
    console.log({
        config
    });

    config.optimization.minimize = false;

    // Consolidate chunk files instead
config.optimization.splitChunks = {
    cacheGroups: {
      default: false,
    },
  };

  config.optimization.runtimeChunk = false;

  config.output.filename = '[name].js';

    //do stuff with the webpack config...
    return config;
}