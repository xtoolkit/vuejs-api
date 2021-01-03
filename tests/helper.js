import {mount} from '@vue/test-utils';
import {watch} from 'vue';
import Plugin from '../src';
export const plugin = (component, options) =>
  mount(component, {
    global: {
      plugins: [options ? [Plugin.install, options] : Plugin.install]
    }
  });

// This condition actually should detect if it's an Node environment
if (typeof require.context === 'undefined') {
  const fs = require('fs');
  const path = require('path');

  require.context = (
    base = '.',
    scanSubDirectories = false,
    regularExpression = /\.js$/
  ) => {
    const files = {};
    const files_ = {};
    const baseDir = path.resolve(__dirname, base);

    function readDirectory(directory) {
      fs.readdirSync(directory).forEach(file => {
        const fullPath = path.resolve(directory, file);

        if (fs.statSync(fullPath).isDirectory()) {
          if (scanSubDirectories) readDirectory(fullPath);

          return;
        }

        if (!regularExpression.test(fullPath)) return;
        files[fullPath] = true;
        files_[fullPath.replace(baseDir, '.')] = fullPath;
      });
    }

    readDirectory(baseDir);

    function Module(file) {
      return require(files_[file]);
    }

    Module.keys = () => Object.keys(files_);

    return Module;
  };
}

export const methods = require.context(
  './methods/api',
  true,
  /([a-zA-Z_]+)\.js$/i
);

export const fetchWait = (target, loading = true, fn) =>
  new Promise(res => {
    watch(target, c => {
      if (c.loading === loading) {
        return false;
      }
      res();
    });
    if (fn) {
      fn();
    }
  });

export const useApi = Plugin.useApi;
export const gql = Plugin.gql;
