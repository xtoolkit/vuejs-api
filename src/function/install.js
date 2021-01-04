import {Api} from '../class/Api';
import mixin from './mixin';
import {getMethods, hotReload} from './utils';

export function apiSetByVersion(ver, app, api) {
  if (ver === 3) {
    api.updateContext(app);
    app.provide('api', api);
    app.mixin(mixin(3));
  } else if (ver === 2) {
    app.prototype.$api = api;
    app.mixin(mixin(2));
  } else {
    throw new Error(
      '[Vuejs-Api] Error: this plugin only available on Vue 2 and 3 version'
    );
  }
}

export function install(app, options = {}) {
  const ver = parseInt(app.version.substr(0, app.version.indexOf('.')));
  let methods = null;
  if (options.methods) {
    methods = options.methods;
    delete options.methods;
  }
  const api = new Api(ver, options);
  if (methods !== null) {
    if (typeof methods === 'object') {
      api.updateMethods(methods);
    } else {
      api.updateMethods(getMethods(methods));
      hotReload(module.hot, methods.id, window.location.reload);
    }
  }
  apiSetByVersion(ver, app, api);
}
