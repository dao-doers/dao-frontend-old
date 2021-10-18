/* config-overrides.js */

module.exports = {
    webpack: function override(config, env) {
      console.log({
          configBefore: config,
          envBefore: env
      });

      config.mode = 'development';
      config.optimization.minimize = false;

      // Consolidate chunk files instead
  config.optimization.splitChunks = {
      cacheGroups: {
        default: false,
      },
    };

    config.optimization.runtimeChunk = false;

    config.output.filename = '[name].js';

    console.log({
      configAfter: config
  });

      process.env.NODE_ENV = 'development';

      //do stuff with the webpack config...
      return config;
  },
  paths: function(paths, env) {
    // console.log({
    //   paths
    // });
    // ...add your paths config
    return paths;
  },
}