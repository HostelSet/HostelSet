const withPWA = require('next-pwa')({
  dest: 'public', // Automatically compiles the generated service worker scripts here
  disable: process.env.NODE_ENV === 'development', // Disables caching in dev mode so updates show immediately
  register: true,
  skipWaiting: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Preserved your preference here
}

module.exports = withPWA(nextConfig)