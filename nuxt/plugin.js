import Vue from 'vue';
import vuejsApi, {mixin, getMethods, hotReload} from 'vuejs-api/dist/vuejs-api.nuxt';

const options = <%= serialize(options, null, 2) %>;
let methods = null;
if (options.methods) {
  methods = require.context(
    '<%= options.methods %>',
    true,
    /([a-zA-Z_]+)\.js$/i
  );
}
const api = new vuejsApi(2, options);
if (methods !== null) {
  if (typeof methods === 'object') {
    api.updateMethods(methods);
  } else {
    api.updateMethods(getMethods(methods));
    if (process.client) {
      hotReload(module.hot, methods.id, window?.location.reload);
    }
  }
}

if (!Vue.__vuejs_api__) {
  Vue.__vuejs_api__ = true
  Vue.mixin(mixin(2, api)) // Set up your mixin then
}

export default function (ctx, inject) {
  if (typeof ctx.$api !== 'undefined') {
    return false;
  }
  api.updateVueContext(ctx);
  inject('api', api.wrapper);
}
