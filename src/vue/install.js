import {Api} from '../class/Api';
import mixin from './mixin';
import {getMethods, hotReload} from '../utils';

export function apiSetByVersion(ver, app, api) {
  if (ver === 3) {
    api.setAppContext(app);
    app.provide('api', api.wrapper);
  } else if (ver === 2) {
    app.prototype.$api = api.wrapper;
  } else {
    throw new Error('[Vuejs-Api] Error: This plugin only works in Vue 2 and 3');
  }
  app.mixin(mixin(ver, api));
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
      hotReload(
        module.hot,
        methods.id,
        window.location.reload.bind(window.location)
      );
    }
  }
  apiSetByVersion(ver, app, api);
}
