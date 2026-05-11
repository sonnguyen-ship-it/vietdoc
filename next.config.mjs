/** @type {import('next').NextConfig} */
const nextConfig = {
  // Help when people open http://localhost:PORT/viet-doc (folder name ≠ URL path).
  async redirects() {
    return [
      { source: "/viet-doc", destination: "/", permanent: false },
      { source: "/viet-doc/", destination: "/", permanent: false },
    ]
  },
};

export default nextConfig;
