import {unReactive} from '../function/utils';
import {arrayInclude} from '../function/utils';

export class Xetch {
  constructor({ver, axios, api, config, globalConfig, context}) {
    this.ver = ver;
    this.axios = axios;
    this.apiContext = api;
    this.context = context;

    // default
    this.requestData = undefined; // to methods request swap
    this.defaultResponseData = null;
    this.hooks = [
      'onUploadProgress',
      'onDownloadProgress',
      'onRequest',
      'onResponse'
    ];
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
    this.hooks.forEach(x => {
      this.hook[x] = [];
    });
  }

  get hasRequestData() {
    return arrayInclude(['post', 'put', 'path', 'delete'], this.config.method);
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
          arrayInclude(this.hooks, i) &&
          type === 'function' &&
          !arrayInclude(this.hook[i], item)
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
          page
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

  prepairCancel() {
    const die = this.axios.CancelToken.source();
    this.fetchConfig.cancelToken = die.token;
    this.state.cancel = (x = 'cancelled') => {
      this.state.errordata = x;
      return die.cancel(x);
    };
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
    this.state.appending = false;
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
    } else {
      data = e.message;
    }
    this.state.loading = false;
    this.state.appending = false;
    this.state.error = true;
    this.state.errordata = data;
    this.state.status = status;
  }

  request(normal = false) {
    this.prepairCancel();
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
        if (!normal) {
          return this.context;
        }
      })
      .catch(e => {
        this.onFailed(e);
        if (!normal) {
          return this.context;
        }
      });
    return normal ? this.context : gate;
  }

  initial(initial) {
    const init = unReactive(initial);
    ['data', 'loading', 'error', 'errordata', 'status'].forEach(i => {
      if (typeof init[i] !== 'undefined') {
        this.state[i] = init[i];
      }
    });
    return this.context;
  }

  // Tools
  get state() {
    return this.ver === 3 ? this.context.value : this.context;
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

  preRefetch(page, append) {
    this.state[append ? 'appending' : 'loading'] = true;
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
    return this.request();
  }

  $getPage(page, append = false) {
    this.preRefetch(page, append);
    this.request(true);
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
    if (this.initTools) {
      return false;
    }
    this.initTools = true;
    ['refresh', '$refresh', 'updateConfig'].forEach(tool => {
      this.state[tool] = a => this[tool](a);
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
        this.state.pagination[tool] = (a, b) => this[tool](a, b);
      });
    }
  }
}
