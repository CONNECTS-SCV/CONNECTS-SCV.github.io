/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // GitHub Pages 정적 배포용
  images: {
    unoptimized: true,
  },
  basePath: '',
  assetPrefix: '',
};

export default nextConfig;