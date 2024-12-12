/** @type {import('next').NextConfig} */
const nextConfig = {
    
    output: 'standalone', // for server-side deployments
    images:{
        remotePatterns:[
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com',

            },

            {
                protocol:'https',
                hostname: 'tealerinpos.s3.amazonaws.com',
            },
        ]
    }
    
};

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*', // Backend URL in development
      },
    ];
  },
};

export default nextConfig;
