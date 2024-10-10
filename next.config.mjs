/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["sequelize"],
    // swcPlugins: [
    //   [
    //     'next-superjson-plugin',
    //     {
    //       excluded: [],
    //     },
    //   ],
    // ],
  },
};

export default nextConfig;
