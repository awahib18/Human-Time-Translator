module.exports = {
  apps: [
    {
      name: 'timehuman',
      script: 'npx',
      args: 'serve -s dist -p 3000',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
