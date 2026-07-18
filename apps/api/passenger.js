// Entry point for cPanel "Setup Node.js App" (Phusion Passenger).
// Point the "Application startup file" field to: apps/api/passenger.js
// After `npm run build`, this simply boots the compiled server.
import("./dist/index.js");
