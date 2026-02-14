/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'gateway.pinata.cloud', // For your NFTs
      'api.dicebear.com',     // For the Agents
      'upload.wikimedia.org'  // For the Background
    ],
  },
}

module.exports = nextConfig
