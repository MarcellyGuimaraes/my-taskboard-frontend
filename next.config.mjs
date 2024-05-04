/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.icons8.com', 'img.icons8.com.br', 'icons8.com.br', 'icons8.com'], // Adicione o hostname aqui
  },
  async redirects() {
    return [
      {
        // Redireciona todas as rotas que começam com "/new-task" para a página inicial "/"
        source: '/new-task',
        destination: '/',
        permanent: false, // Define como false para um redirecionamento temporário
      },
      {
        // Redireciona todas as rotas que correspondem a "/task/:id" para a página inicial "/"
        source: '/task/:id',
        destination: '/',
        permanent: false, // Define como false para um redirecionamento temporário
      },
    ];
  },
};

export default nextConfig;