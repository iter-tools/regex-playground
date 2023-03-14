const mdxDefineConfig = require("@next/mdx");

const mdxMergeConfig = mdxDefineConfig({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: "@mdx-js/react",
  },
});

/** @type {import("next").NextConfig} */
const nextConfig = mdxMergeConfig({
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: true,
});

module.exports = nextConfig;
