import Vue from 'vue';
import {Api, installSSR, getMethods} from 'vuejs-api';

const config = <%= serialize(options, null, 2) %>;

if (typeof config.src !== 'undefined') {
  config.src = require.context(
    '<%= options.src %>',
    true,
    /([a-zA-Z_]+)\.js$/i
  );
}

Vue.use(installSSR);

export default function (ctx, inject) {
  if (typeof ctx.$api !== 'undefined') {
    return false;
  }

  const api = new Api(config);

  api.updateContext(ctx);
  inject('api', api);

  if (typeof config.src === 'undefined') {
    return false;
  }

  api.updateMethods(getMethods(config.src));
  if (module.hot) {
    module.hot.accept(config.id, () => {
      window.location.reload();
    });
  }
}
