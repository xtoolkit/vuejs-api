import {Api} from '../class/Api';
import mixin from './mixin';

export function getMethods(context) {
  const modules = {};
  const keys = context.keys();
  keys.forEach(key => {
    modules[
      key.replace(/^\//, '').replace(/^\.\//, '').replace(/\.js$/, '')
    ] = context(key).default;
  });
  return modules;
}

export function hotReload(hot, id, fn) {
  if (hot) {
    hot.accept(id, () => {
      fn();
    });
  }
}

export function install(app, options = {}) {
  let methods = null;
  if (options.methods) {
    methods = options.methods;
    delete options.methods;
  }
  const api = new Api(options, app);
  if (methods !== null) {
    if (typeof methods === 'object') {
      api.updateMethods(methods);
    } else {
      api.updateMethods(getMethods(methods));
      hotReload(module.hot, methods.id, window.location.reload);
    }
  }
  app.provide('api', api);
  app.mixin(mixin);
}
