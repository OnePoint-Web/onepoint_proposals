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
    "/api/discovery/**": [
      "./node_modules/@sparticuz/chromium/bin/**",
    ],
  },
  reactCompiler: true,
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ]
  },
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
