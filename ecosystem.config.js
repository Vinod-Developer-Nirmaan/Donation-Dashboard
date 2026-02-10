module.exports = {
  apps: [
    {
      name: 'nirmaan-dashboard',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/home/donations-dashboard.thenirmaan.ai/public_html',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
