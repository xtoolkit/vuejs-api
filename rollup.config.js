import babel from '@rollup/plugin-babel';
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
      exclude: 'node_modules/**'
    }),
    process.env.NODE_ENV === 'production' && terser()
  ],
  external: ['axios'],
  output: [
    process.env.NODE_ENV !== 'production' && {
      file: 'dist/vue-api.common.js',
      format: 'cjs'
    },
    process.env.NODE_ENV !== 'production' && {
      file: 'dist/vue-api.esm.js',
      format: 'esm'
    },
    process.env.NODE_ENV === 'production' && {
      file: 'dist/vue-api.min.js',
      format: 'umd',
      name: 'VueApi'
    }
  ]
};

export default config;
