import Vue from 'vue';
import {Api, install} from 'vuejs-api';

const config = <%= serialize(options, null, 2) %>;

if (typeof config.src !== 'undefined') {
  config.src = require.context(
    '<%= options.src %>',
    true,
    /([a-zA-Z_]+)\.js$/i
  );
}

Vue.use(install, config);

export default function (ctx, inject) {
  const api = new Api(config);
  api.updateContext(ctx.app);
  ctx.$api = api;
  inject('api', api);
}
