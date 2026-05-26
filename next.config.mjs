/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  /** Lexical / subpackages ship modern ESM; transpiling avoids occasional RSC/runtime issues on Vercel. */
  transpilePackages: [
    "lexical",
    "@lexical/react",
    "@lexical/rich-text",
    "@lexical/history",
    "@lexical/list",
    "@lexical/link",
    "@lexical/selection",
    "@lexical/utils",
    "@lexical/table",
  ],

  /**
   * Fewer watched paths → fewer open file descriptors (helps macOS EMFILE / Watchpack warnings).
   * Only applied in development; production builds ignore watchOptions.
   */
  webpack: (config, { dev }) => {
    if (dev) {
      // String globs only (do not merge Next defaults — mixed types break webpack schema).
      config.watchOptions = {
        ...config.watchOptions,
        aggregateTimeout: 600,
        followSymlinks: false,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.git/objects/**",
          "**/.git/cursor/**",
          "**/.next/**",
          "**/out/**",
          "**/.turbo/**",
          "**/coverage/**",
          "**/.vercel/**",
          "**/tsconfig.tsbuildinfo",
          "**/.tmp-*",
        ],
      }
    }
    return config
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ]
  },

  // Help when people open http://localhost:PORT/viet-doc (folder name ≠ URL path).
  async redirects() {
    return [
      { source: "/viet-doc", destination: "/", permanent: false },
      { source: "/viet-doc/", destination: "/", permanent: false },
      { source: "/viet-doc/:path*", destination: "/", permanent: false },
    ]
  },
}

export default nextConfig
