/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile ESM-only packages so Next.js can SSR/bundle them with webpack
  transpilePackages: ['lenis'],

  async rewrites() {
    // Only proxy routes still handled by the Python backend.
    // /api/upload is now a Next.js Route Handler (app/api/upload/route.ts).
    return [
      { source: '/api/query',  destination: 'http://localhost:8000/api/query' },
      { source: '/api/models', destination: 'http://localhost:8000/api/models' },
      { source: '/api/health', destination: 'http://localhost:8000/api/health' },
    ]
  },
}

export default nextConfig
