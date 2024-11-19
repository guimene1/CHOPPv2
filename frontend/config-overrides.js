module.exports = function override(config, env) {
    if (env === 'development') {
      config.devServer = {
        ...config.devServer,
        allowedHosts: 'all', // Use 'all' to allow any hostname
      };
    }
    return config;
  };
  