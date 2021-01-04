import {inject} from 'vue';
import {arrayInclude} from './utils';

export default function (ver) {
  return {
    beforeCreate() {
      this._api = this.$options.api || false;
      delete this.$options.api;
      if (ver === 3) {
        if (this._api) {
          this.$api = inject('api');
        }
      } else if (ver === 2) {
        if (typeof this.$api !== 'undefined' && this.$api.init === false) {
          this.$api.updateContext(this);
        }
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
    created() {
      if (!this._api) {
        return false;
      }
      for (const api in this._api) {
        if (Object.keys(this._api[api]).length === 0) {
          this[api] = this.$api.createContext();
        }
      }
    },
    beforeMount() {
      if (!this._api) {
        return false;
      }
      for (const api in this._api) {
        const item = this._api[api];
        const keys = Object.keys(item);
        if (keys.length === 0) {
          continue;
        }
        const config = {};
        keys.forEach(key => {
          config[key] = item[key];
          if (
            typeof config[key] === 'function' &&
            !arrayInclude(
              [
                'onUploadProgress',
                'onDownloadProgress',
                'onRequest',
                'onResponse'
              ],
              key
            )
          ) {
            config[key] = () => item[key].apply(this);
          }
        });
        let method = item.method;
        if (typeof method === 'function') {
          method = method.apply(this);
        }
        this[api] = this.$api.fetch(method, config);
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
}
