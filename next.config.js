/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    async rewrites() {
      return [
        {
          source: '/:type*',        
          destination: '/home',
        },
      ]
    },
    images: {
      domains: ["localhost"],      
      unoptimized: true,     
      minimumCacheTTL :5 
    },
    
    
}

module.exports = nextConfig
