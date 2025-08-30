import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// Turbopack requires plugin names as strings and JSON-serializable options
const mdxOptions = {
  // If you need GFM tables/footnotes etc, use string form too:
  // remarkPlugins: [["remark-gfm", { /* gfm opts */ }]],
  remarkPlugins: ["remark-gfm"],
  rehypePlugins: [
    ["rehype-pretty-code", { theme: "solarized-dark", keepBackground: false }],
  ],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: mdxOptions,
});

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // Ensure JS loader path is used so string plugins work
  experimental: { mdxRs: false },
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/decvnwos9/image/upload/**",
      },
    ],
  },
};

export default withMDX(nextConfig);
