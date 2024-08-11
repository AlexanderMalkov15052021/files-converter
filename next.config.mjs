/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['rc-util', '@ant-design'],
  webpack: config => {
    config.module.rules.push({

      test: /\.worker\.js$/,
      use: { loader: "worker-loader" },

    })

    return config
  },
};

export default nextConfig;
