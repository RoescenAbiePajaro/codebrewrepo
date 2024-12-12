// next.config.js
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

export default nextConfig;
