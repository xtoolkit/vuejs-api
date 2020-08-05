export default {
  beforeCreate() {
    const vmOptions = this.$options;
    this._api = vmOptions.api || false;
    if (typeof this.$api === 'undefined') {
      console.log(this);
    }
    if (typeof this.$api !== 'undefined' && this.$api.init === false) {
      this.$api.updateContext(this);
    }
  },
  data() {
    if (this._api === false) {
      return {};
    }
    const o = {};
    Object.keys(this._api).forEach(key => {
      o[key] = {};
    });
    return o;
  },
  beforeMount() {
    if (this._api === false) {
      return false;
    }
    Object.keys(this._api).forEach(item => {
      const config = this._api[item];
      if (Object.keys(config).length === 0) {
        return false;
      }
      let method = config.method;
      if (typeof method === 'function') {
        method = method.apply(this);
      }
      if (typeof config.params === 'function') {
        config.params = config.params.apply(this);
      }
      if (typeof config.headers === 'function') {
        config.headers = config.headers.apply(this);
      }
      this[item] = this.$api.fetch(method, config);
    });
  },
  beforeDestroy() {
    if (this._api === false) {
      return false;
    }
    Object.keys(this._api).forEach(key => {
      if (this[key].cancel) {
        this[key].cancel();
      }
    });
  }
};
