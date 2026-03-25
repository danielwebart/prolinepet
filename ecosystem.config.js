module.exports = {
  apps: [
    {
      name: 'portal-web',
      script: 'server.js',
      cwd: require('path').join(__dirname, '.next', 'standalone'),
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
