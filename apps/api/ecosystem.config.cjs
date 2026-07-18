// PM2 process file — used when running the API via SSH (pm2 start ecosystem.config.cjs)
// If cPanel "Setup Node.js App" (Passenger) runs the app, PM2 is optional.
module.exports = {
  apps: [
    {
      name: "uniteacademy-api",
      script: "dist/index.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      time: true,
    },
  ],
};
