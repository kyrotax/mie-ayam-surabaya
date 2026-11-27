/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/owner',
        destination: '/admin',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: '/admin',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

