export default {
  beforeCreate() {
    const vmOptions = this.$options;
    this._api = vmOptions.api || false;
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
    for (const item in this._api) {
      const config = this._api[item];
      if (Object.keys(config).length === 0) {
        this[item] = {
          load: false,
          error: false,
          paging: false
        };
        return false;
      }
      const options = {};
      let method = config.method;
      if (typeof method === 'function') {
        method = method.apply(this);
      }
      if (typeof config.params === 'function') {
        options.params = config.params.apply(this);
      } else if (typeof config.params !== 'undefined') {
        options.params = config.params;
      }
      if (typeof config.headers === 'function') {
        options.headers = config.headers.apply(this);
      } else if (typeof config.headers !== 'undefined') {
        options.headers = config.headers;
      }
      if (typeof config.query !== 'undefined') {
        options.query = config.query;
      }
      this[item] = this.$api.fetch(method, options);
    }
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
