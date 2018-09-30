import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import license from 'rollup-plugin-license';
import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import packageJSON from './package.json'
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',

  output: {
    name: 'Jerrbit',
    format: 'umd'
  },

  plugins: [
    babel({
      exclude: 'node_modules/(?!query-string)/**',
    }),

    commonjs({
      namedExports: {
        'node_modules/platform/platform.js': ['os']
      },

      exclude: [ 'node_modules/clone-function/src/**' ]
    }),

    resolve({
      module: true,
      main: true,
      browser: true
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
