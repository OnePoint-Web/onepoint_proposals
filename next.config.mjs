/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    "@sparticuz/chromium",
    "puppeteer-core",
  ],
   outputFileTracingIncludes: {
    "/api/proposals/**": [
      "./node_modules/@sparticuz/chromium/bin/**",
    ],
  },
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
      {
        protocol: "https",
        hostname: "media.1pt.com.au",
      },
      
    ],
  },
}

export default nextConfig
