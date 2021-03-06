import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import license from 'rollup-plugin-license';
import path from 'path';
import packageJSON from './package.json';

export default {
  input: 'src/index.js',

  output: {
    exports: 'named',
    format: 'cjs'
  },

  external: [
    'cookie',
    'object-merge',
    'platform',
    'query-string',
    'stack-trace',
    'whatwg-fetch'
  ],

  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),

    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      JERBIT_VERSION: packageJSON.version
    }),

    (process.env.NODE_ENV === 'production' && uglify()),

    license({
      banner: {
        file: path.join(__dirname, 'LICENSE'),
      }
    })
  ]
};
