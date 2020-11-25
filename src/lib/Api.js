import axios from 'axios';
import {Xetch} from './Xetch';
import {fixContext, unReactive, merge} from '../helper/utils';
import graphql from '../helper/graphql';

export class Api {
  constructor(options) {
    this.options = options;
    this.global = {
      headers: {},
      params: {},
      options: {},
      hook: {
        onUploadProgress: [],
        onDownloadProgress: [],
        onRequest: [],
        onResponse: []
      }
    };
    merge(this.global, options.default);
    this.ctx = null;
    this.init = false;
    this.setupAxios();
    Api.prototype['graphql'] = graphql;
  }

  setup(ctx) {
    this.ctx = ctx;
    this.init = true;
  }

  setupAxios() {
    this.$axios = axios.create(this.options.axios || {});
    this.$axios.CancelToken = axios.CancelToken;
    this.$axios.isCancel = axios.isCancel;
  }

  updateMethods(methods) {
    Object.keys(methods).forEach(item => {
      Api.prototype[item] = methods[item];
    });
  }

  manual(config) {
    return config;
  }

  gate(method, config, mode) {
    const op = ['params', 'headers', 'options', 'hook'];
    fixContext(op, config);
    config = unReactive(config);

    if (/^graphql\//.test(method)) {
      config.client = method.replace(/^graphql\//, '');
      method = 'graphql';
    }

    const _config = this.global;
    merge(_config, config);
    let initialConfig = this[method](_config);

    fixContext(op, initialConfig, config);
    _config.hook.onRequest.forEach(f => {
      if (typeof f === 'function') {
        initialConfig = f(initialConfig);
      }
    });

    if (typeof initialConfig.onResponse !== 'undefined') {
      _config.hook.onResponse.push(initialConfig.onResponse);
    }

    const gate = new Xetch({
      axios: this.$axios,
      initial: initialConfig,
      method: this[method],
      config,
      options: _config.options,
      hook: _config.hook
    });

    if (mode === 'request') {
      return gate.fetch();
    } else if (mode === 'initial') {
      return gate.initial();
    } else if (mode === 'fetch') {
      return gate.$fetch();
    }
  }

  request(method, config = {}) {
    return this.gate(method, config, 'request');
  }

  fetch(method, config = {}) {
    return this.gate(method, config, 'fetch');
  }

  initial(method, config = {}) {
    return this.gate(method, config, 'initial');
  }
}

export default Api;
