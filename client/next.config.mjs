/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["ipfs.io", "gateway.pinata.cloud"],
    // hostname: ["peach-obvious-locust-150.mypinata.cloud"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "peach-obvious-locust-150.mypinata.cloud",
      },
    ],
  },
};

export default nextConfig;
