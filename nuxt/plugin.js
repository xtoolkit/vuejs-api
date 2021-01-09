import Vue from 'vue';
import vuejsApi, {
  mixin,
  getMethods,
  hotReload
} from 'vuejs-api/dist/vuejs-api.nuxt';
import options from '<%= options %>';

let methods = null;
if (options.methods) {
  methods = options.methods;
  delete options.methods;
}
const api = new vuejsApi(2, options);
if (methods !== null) {
  if (typeof methods === 'object') {
    api.updateMethods(methods);
  } else {
    api.updateMethods(getMethods(methods));
    if (process.client) {
      hotReload(
        module.hot,
        methods.id,
        window.location.reload.bind(window.location)
      );
    }
  }
}

if (!Vue.__vuejs_api__) {
  Vue.__vuejs_api__ = true;
  Vue.mixin(mixin(2, api)); // Set up your mixin then
}

export default function (ctx, inject) {
  if (typeof ctx.$api !== 'undefined') {
    return false;
  }
  api.setAppContext(ctx);
  inject('api', api.wrapper);
}
