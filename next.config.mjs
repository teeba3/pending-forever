const isProd = process.env.NODE_ENV === 'production';
/** Static export so it can be hosted on GitHub Pages. */
export default {
  output: 'export',
  basePath: isProd ? '/pending-forever' : '',
  images: { unoptimized: true },
  trailingSlash: true,
};
