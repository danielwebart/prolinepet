module.exports = {
  apps: [
    {
      name: 'portalWeb',
      script: 'npm',
      args: 'start',
      cwd: 'D:\\Sites\\portalWeb',
      instances: 1,
      exec_mode: 'fork',
      interpreter: 'none',
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
