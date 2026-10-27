const nextConfig = {
  trailingSlash: true,
  outputFileTracingRoot: import.meta.dirname,
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
};
export default nextConfig;
