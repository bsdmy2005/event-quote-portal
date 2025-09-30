/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Allow production builds to complete with warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to complete with type warnings
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
