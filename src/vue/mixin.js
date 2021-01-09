import {inject} from 'vue';
import {inArray} from '../utils';
import events from '../events';
export default function (ver, instance) {
  const o = {
    beforeCreate() {
      this._api = this.$options.api || false;
      delete this.$options.api;
      if (ver === 3) {
        if (this._api) {
          this.$api = inject('api');
        }
      } else if (ver === 2) {
        if (typeof this.$api !== 'undefined' && this.$api.init === false) {
          instance.setAppContext(this);
        }
      }
    },
    data() {
      if (!this._api) {
        return {};
      }
      const o = {};
      for (const item in this._api) {
        o[item] = instance.createRes(false);
      }
      return o;
    },
    beforeMount() {
      if (!this._api) {
        return false;
      }
      for (const item in this._api) {
        const api = this._api[item];
        const keys = Object.keys(api);
        if (keys.length === 0) {
          continue;
        }
        const config = {};
        keys.forEach(key => {
          config[key] = api[key];
          if (typeof config[key] === 'function' && !inArray(events, key)) {
            config[key] = api[key].bind(this);
          }
        });
        let method = api.method;
        if (typeof method === 'function') {
          method = method.apply(this);
        }
        this[item] = this.$api.fetch(method, config);
      }
    }
  };

  o[ver === 3 ? 'beforeUnmount' : 'beforeDestroy'] = function () {
    if (!this._api) {
      return false;
    }
    for (const item in this._api) {
      this[item].cancel();
    }
  };

  return o;
}
