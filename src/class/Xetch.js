import {unReactive, inArray} from '../utils';
import events from '../events';

export class Xetch {
  constructor(ver, axios, api, config, globalConfig, vue, res) {
    this.ver = ver;
    this.axios = axios;
    this.apiContext = api;
    this.vue = vue;
    this.res = res;

    // default
    this.requestData = undefined; // to methods request swap
    this.defaultResponseData = null;
    this.hook = {};
    this.initialHooks();
    this.preConfigs = {
      global: globalConfig,
      request: config,
      update: {},
      method: {}
    };
    this.fetchConfig = {};
    this.config = {
      method: 'get',
      url: ''
    };
    this.initTools = false;
    this.renderConfig();
  }

  initialHooks() {
    events.forEach(x => {
      this.hook[x] = [];
    });
  }

  get hasRequestData() {
    return inArray(['post', 'put', 'path', 'delete'], this.config.method);
  }

  updateConfig(config) {
    for (const key in config) {
      const item = config[key];
      if (
        typeof this.preConfigs.update[key] === 'undefined' ||
        typeof item !== 'object'
      ) {
        this.preConfigs.update[key] = item;
        continue;
      }
      for (const i in item) {
        this.preConfigs.update[key][i] = item[i];
      }
    }
  }

  renderAzPreConfig(configs) {
    configs.forEach(config => {
      for (const i in this.preConfigs[config]) {
        const item = this.preConfigs[config][i];
        const type = typeof item;
        if (
          inArray(events, i) &&
          type === 'function' &&
          !inArray(this.hook[i], item)
        ) {
          this.hook[i].push(item);
          continue;
        }
        const applyed = unReactive(type === 'function' ? item() : item);
        if (
          typeof this.config[i] === 'undefined' ||
          (config === 'method' && i === 'params') ||
          typeof applyed !== 'object'
        ) {
          this.config[i] = applyed;
          continue;
        }
        for (const name in applyed) {
          this.config[i][name] = applyed[name];
        }
      }
    });
  }

  setPagination({page = 0}) {
    if (this.hasPagination) {
      if (this.state.pagination) {
        this.state.pagination.page = page;
      } else {
        this.state.pagination = {
          page,
          appending: false
        };
      }
    }
  }

  setHooks() {
    ['onUploadProgress', 'onDownloadProgress'].forEach(s => {
      if (this.hook[s].length > 0 && typeof this.config[s] === 'undefined') {
        this.fetchConfig[s] = data => {
          this.hook[s].forEach(fn => {
            fn(data);
          });
        };
      }
    });
  }

  setOptions() {
    if (this.config.options) {
      for (const op in this.config.options) {
        this.fetchConfig[op] = this.config.options[op];
      }
    }
  }

  explodeRequestData() {
    if (this.hasRequestData) {
      this.requestData = this.config.params;
    } else {
      this.fetchConfig.params = this.config.params;
    }
    this.fetchConfig.headers = this.config.headers;
  }

  renderConfig(append = false) {
    this.hook = {};
    this.initialHooks();
    this.config = {};
    this.renderAzPreConfig(['global', 'request', 'update']);
    const prePagination = this.config.params
      ? this.config.params.pagination || false
      : false;
    if (typeof this.config.params === 'undefined') {
      this.config.params = {};
    }
    const config = this.apiContext(this.config);
    this.preConfigs.method = config;
    this.renderAzPreConfig(['method']);
    this.defaultResponseData = config.default || null;
    if (!append) {
      this.state.data =
        this.defaultResponseData === null
          ? null
          : unReactive(this.defaultResponseData);
    }
    this.setPagination(prePagination);
    this.setHooks();
    this.setOptions();
    this.explodeRequestData();
    this.setTools();
  }
  onSeccessful({status, data}) {
    this.state.status = status;
    if (this.defaultResponseData === null) {
      this.state.data = data;
    }
    this.hook.onResponse.forEach(fn => {
      fn.apply(this, [data]);
    });
    this.state.loading = false;
    if (this.hasPagination) {
      this.state.pagination.appending = false;
    }
  }

  onFailed(e) {
    let data = null;
    let status = -1;
    if (e.response) {
      status = e.response.status;
      data = {
        headers: e.response.headers,
        data: e.response.data
      };
    } else if (e.request) {
      data = e.request;
      data.message = e.message;
    } else {
      data = e.message;
    }
    this.state.loading = false;
    if (this.hasPagination) {
      this.state.pagination.appending = false;
    }
    this.state.error = true;
    this.state.errordata = data;
    this.state.status = status;
    if (/^timeout/.test(data.message)) {
      this.hook.onTimeout.forEach(fn => {
        fn.apply(this);
      });
    }
  }

  setCancel() {
    if (!this.useTools) {
      return false;
    }
    const die = this.axios.CancelToken.source();
    this.fetchConfig.cancelToken = die.token;
    this.state.cancel = (x = 'cancelled') => {
      this.hook.onCancel.forEach(fn => {
        fn.apply(this);
      });
      return die.cancel(x);
    };
  }

  request(promise) {
    this.setCancel();
    this.hook.onRequest.forEach(fn => {
      fn.apply(this);
    });
    const gate = this.axios[this.config.method || 'get'](
      this.config.url,
      this.hasRequestData ? this.requestData : this.fetchConfig,
      this.hasRequestData ? this.fetchConfig : undefined
    )
      .then(res => {
        this.onSeccessful(res);
        if (promise) {
          return this.res;
        }
      })
      .catch(e => {
        this.onFailed(e);
        if (promise) {
          return this.res;
        }
      });
    return promise ? gate : this.res;
  }

  initial(initial) {
    const init = unReactive(initial);
    ['data', 'loading', 'error', 'errordata', 'status'].forEach(i => {
      if (typeof init[i] !== 'undefined') {
        this.state[i] = init[i];
      }
    });
    return this.res;
  }

  // Tools
  get state() {
    return this.ver === 3 ? this.res.value : this.res;
  }

  get data() {
    return this.state.data;
  }

  set data(value) {
    this.state.data = value;
  }

  get params() {
    return this.config.params;
  }

  get hasPagination() {
    return this.config.pagination === true;
  }

  get page() {
    return this.state.pagination.page;
  }

  set page(page) {
    this.state.pagination.page = page;
  }

  get useTools() {
    return typeof this.config.tools === 'boolean' ? this.config.tools : true;
  }

  preRefetch(page, append) {
    if (append) {
      this.state.pagination.appending = true;
    } else {
      this.state.loading = true;
    }
    this.state.error = false;
    this.state.status = -1;
    this.state.errordata = null;
    if (page !== false && this.hasPagination) {
      this.page = page;
      this.updateConfig({
        params: {
          pagination: {
            page
          }
        }
      });
    }
    this.renderConfig(append);
  }

  getPage(page, append = false) {
    this.preRefetch(page, append);
    return this.request(true);
  }

  $getPage(page, append = false) {
    this.preRefetch(page, append);
    this.request(false);
  }

  refresh() {
    return this.getPage(false);
  }

  $refresh() {
    this.$getPage(false);
  }

  append() {
    return this.getPage(this.page + 1, true);
  }

  $append() {
    this.$getPage(this.page + 1, true);
  }

  next() {
    return this.getPage(this.page + 1);
  }

  $next() {
    this.$getPage(this.page + 1);
  }

  prev() {
    return this.getPage(this.page - 1);
  }

  $prev() {
    this.$getPage(this.page - 1);
  }

  setTools() {
    if (!this.useTools) {
      if (this.state.cancel) {
        this.state.cancel = undefined;
      }
      return false;
    }
    if (this.initTools) {
      return false;
    }
    this.initTools = true;
    ['refresh', '$refresh', 'updateConfig'].forEach(tool => {
      this.state[tool] = this[tool].bind(this);
    });
    if (this.hasPagination) {
      [
        'getPage',
        '$getPage',
        'append',
        '$append',
        'next',
        '$next',
        'prev',
        '$prev'
      ].forEach(tool => {
        this.state.pagination[tool] = this[tool].bind(this);
      });
    }
  }
}
