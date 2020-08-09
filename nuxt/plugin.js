import Vue from 'vue';
import {Api, installSSR} from 'vuejs-api';

const config = <%= serialize(options, null, 2) %>;

if (typeof config.src !== 'undefined') {
  config.src = require.context(
    '<%= options.src %>',
    true,
    /([a-zA-Z_]+)\.js$/i
  );
}

Vue.use(installSSR, config);

export default function (ctx, inject) {
  if (
    typeof Vue.prototype.$api !== 'undefined' ||
    Vue.$api !== 'undefined' ||
    ctx.$api !== 'undefined'
  ) {
    return false;
  }

  let src = null;
  if (typeof config.src !== 'undefined') {
    src = config.src;
    delete config.src;
  }

  const api = new Api(config);
  Vue.prototype.$api = api;

  if (src === null) {
    return false;
  }

  if (typeof src === 'object') {
    api.updateMethods(src);
    return false;
  }

  if (typeof src !== 'function') {
    return false;
  }

  api.updateMethods(getMethods(src));
  if (module.hot) {
    module.hot.accept(src.id, () => {
      window.location.reload();
    });
  }
}
