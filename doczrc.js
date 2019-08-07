// doczrc.js
// eslint-disbale
import path from 'path';
import { css } from 'docz-plugin-css';

export default {
  wrapper: 'src/wrapper',
  dest: '/docz-dist',
  codeSandbox: false,
  files: '**/*.mdx',
  typescript: true,
  filterComponents: files => files.filter(filepath => /[w-]*.(js|jsx|ts|tsx)$/.test(filepath)),
  plugins: [
    css({
      preprocessor: 'sass',
      cssmodules: true,
    }),
    css({
      preprocessor: 'postcss',
    }),
  ],
  onCreateWebpackChain(config) {
    config.resolve.alias.set('cpant', path.join(__dirname, 'components'));
    return config;
  },
};
