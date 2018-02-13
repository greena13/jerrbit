import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import license from 'rollup-plugin-license';
import path from 'path';
import json from 'rollup-plugin-json';

export default {
  input: 'src/index.js',

  output: {
    format: 'cjs',
    file: process.env.NODE_ENV === 'production' ? 'cjs/jerrbit.production.min.js' : 'cjs/jerrbit.development.js',
    exports: 'named'
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
    json({
      preferConst: true,
    }),

    babel({
      exclude: 'node_modules/**'
    }),

    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }),

    (process.env.NODE_ENV === 'production' && uglify()),

    license({
      banner: {
        file: path.join(__dirname, 'LICENSE'),
      }
    })
  ]
};
