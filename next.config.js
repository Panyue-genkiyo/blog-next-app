/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

const withTM = require("next-transpile-modules")
 (["react-google-login-lite", "react-facebook-login-lite", "gapi-script"]);

module.exports = withTM({
 reactStrictMode: false,
 async rewrites() {
  return [
   { source: '/api/:path*', destination: `http://localhost:5001/api/:path*` },
  ]
 },
 images: {
  domains: ['res.cloudinary.com', 'images.pexels.com'],
 },
});
