import buble from '@rollup/plugin-buble';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import {terser} from 'rollup-plugin-terser';
import pkg from './package.json';

const banner = `/*!
 * Vuejs-Api v${pkg.version}
 * (c) ${new Date().getFullYear()} Mehdi HosseinZade
 * @license MIT
 */`;

const configs = [
  {
    input: 'src/index.js',
    file: 'dist/vuejs-api.esm.js',
    format: 'es',
    env: 'development'
  },
  {
    input: 'src/index.cjs.js',
    file: 'dist/vuejs-api.global.js',
    format: 'iife',
    minify: true,
    env: 'production'
  },
  {
    input: 'src/index.cjs.js',
    file: 'dist/vuejs-api.cjs.js',
    format: 'cjs',
    env: 'development'
  },
  {
    input: 'src/index.nuxt.js',
    file: 'dist/vuejs-api.nuxt.js',
    format: 'es',
    env: 'development'
  }
];

function createEntries() {
  return configs.map(c => createEntry(c));
}

function createEntry(config) {
  const c = {
    external: ['vue', 'axios'],
    input: config.input,
    plugins: [],
    output: {
      banner,
      file: config.file,
      format: config.format,
      globals: {
        vue: 'Vue',
        axios: 'axios'
      }
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg);
      }
    }
  };

  if (config.format === 'iife') {
    c.output.name = c.output.name || 'vuejsApi';
  }

  if (config.format === 'cjs') {
    c.output.exports = 'auto';
  }

  c.plugins.push(
    replace({
      __VERSION__: pkg.version,
      'process.env.NODE_ENV': `'${config.env}'`
    })
  );

  if (config.transpile !== false) {
    c.plugins.push(buble());
  }

  c.plugins.push(resolve());
  c.plugins.push(commonjs());

  if (config.minify) {
    c.plugins.push(terser({module: config.format === 'es'}));
  }

  return c;
}

export default createEntries();
