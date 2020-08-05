import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

const config = {
  input: 'src/index.js',
  plugins: [
    resolve({
      mainFields: ['jsnext', 'main', 'browser']
    }),
    commonjs({
      exclude: ['src/*', 'src/components/*']
    }),
    babel({
      babelrc: false,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            // useBuiltIns: 'usage',
            targets: {
              browsers: [
                '> 1%',
                'Chrome >= 14',
                'Safari >= 4',
                'Firefox >= 4',
                'Opera >= 10',
                'Edge >= 41',
                'ie >= 9',
                'iOS >= 6',
                'ChromeAndroid >= 4',
                'OperaMobile >= 12'
              ]
            }
          }
        ]
      ],
      plugins: ['@babel/plugin-transform-runtime'],
      exclude: 'node_modules/**',
      babelHelpers: 'runtime'
    }),
    process.env.NODE_ENV === 'production' && terser()
  ],
  external: ['axios'],
  output: []
};

if (process.env.NODE_ENV === 'production') {
  config.output.push({
    file: 'dist/vuejs-api.min.js',
    format: 'iife',
    name: 'VueJsApi',
    globals: {
      axios: 'axios'
    }
  });
} else {
  config.output.push({
    file: 'dist/vuejs-api.common.js',
    format: 'cjs',
    name: 'VueJsApi'
  });
  config.output.push({
    file: 'dist/vuejs-api.es.js',
    format: 'es',
    name: 'VueJsApi'
  });
  config.output.push({
    file: 'dist/vuejs-api.js',
    format: 'umd',
    name: 'VueJsApi',
    globals: {
      axios: 'axios'
    },
    exports: 'named'
  });
}

export default config;
