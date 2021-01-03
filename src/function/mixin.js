import {inject} from 'vue';

export default {
  beforeCreate() {
    this._api = this.$options.api || false;
    delete this.$options.api;
    if (this._api) {
      this.api = inject('api');
    }
  },
  data() {
    if (!this._api) {
      return {};
    }
    const o = {};
    for (const item in this._api) {
      o[item] = {};
    }
    return o;
  },
  beforeMount() {
    if (!this._api) {
      return false;
    }
    for (const api in this._api) {
      const item = this._api[api];
      const keys = Object.keys(item);
      if (keys.length === 0) {
        this[api] = this.api.createContext();
        continue;
      }
      const config = {};
      keys.forEach(key => {
        config[key] = item[key];
        if (
          typeof config[key] === 'function' &&
          ![
            'onUploadProgress',
            'onDownloadProgress',
            'onRequest',
            'onResponse'
          ].includes(key)
        ) {
          config[key] = () => item[key].apply(this);
        }
      });
      let method = item.method;
      if (typeof method === 'function') {
        method = method.apply(this);
      }
      this[api] = this.api.fetch(method, config);
    }
  },
  beforeUnmount() {
    if (!this._api) {
      return false;
    }
    for (const api in this._api) {
      this[api].cancel();
    }
  }
};
