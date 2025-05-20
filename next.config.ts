/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com','www.refugee-action.org.uk'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  experimental: {
    missingSuspenseWithCSRError: false,
  },
  staticPageGenerationTimeout: 120,
};

export default nextConfig;