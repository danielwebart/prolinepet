module.exports = {
  apps: [
    {
      name: 'portalweb',
      script: 'D:\\Sites\\portalWeb\\node_modules\\next\\dist\\bin\\next',
      args: 'start -p 3000',
      interpreter: 'C:\\Program Files\\nodejs\\node.exe',
      env: { NODE_ENV: 'production' },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      windowsHide: true
    }
  ]
};
