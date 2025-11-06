/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // API routes를 사용하려면 주석 처리
  images: {
    unoptimized: true,
  },
  basePath: '',
  assetPrefix: '',
};

export default nextConfig;