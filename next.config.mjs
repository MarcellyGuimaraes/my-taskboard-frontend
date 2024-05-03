/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.icons8.com', 'img.icons8.com.br', 'icons8.com.br', 'icons8.com'], // Adicione o hostname aqui
  },
  async rewrites() {
    return [
      {
        source: '/new-task',
        destination: '/new-task',
      },
      {
        source: '/task/:id',
        destination: '/task/[id]',
      },
    ];
  },
};

export default nextConfig;