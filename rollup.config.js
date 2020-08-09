import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

const config = {
  input: 'src/index.js',
  plugins: [
    babel({
      babelrc: false,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            useBuiltIns: 'usage',
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
            },
            corejs: 3
          }
        ]
      ],
      exclude: 'node_modules/**'
    })
  ],
  external: ['axios'],
  output: []
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    resolve({
      mainFields: ['jsnext', 'main', 'browser']
    })
  );
  config.plugins.push(terser());
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
