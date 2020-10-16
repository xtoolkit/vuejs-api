import axios from 'axios';
import {Xetch} from './Xetch';
import graphql from '../helper/graphql';

export class Api {
  constructor(options) {
    this.$axios = axios.create(options.axios || {});
    this.$axios.CancelToken = axios.CancelToken;
    this.$axios.isCancel = axios.isCancel;
    this.options = options;
    this.default = {
      headers: {}
    };
    this.ctx = null;
    this.init = false;
    Api.prototype['graphql'] = graphql;
  }

  updateMethods(methods) {
    Object.keys(methods).forEach(item => {
      Api.prototype[item] = methods[item];
    });
  }

  updateContext(ctx) {
    this.ctx = ctx;
    this.init = true;
  }

  manual(config) {
    return config;
  }

  gate(method, config, mode) {
    if (typeof config.params === 'undefined') {
      config.params = {};
    }
    if (typeof config.headers === 'undefined') {
      config.headers = {};
    }

    if (/^graphql\//.test(method)) {
      config.client = method.replace(/^graphql\//, '');
      method = 'graphql';
    }

    let initialConfig = this[method](config);

    if (typeof initialConfig.params === 'undefined') {
      initialConfig.params =
        typeof config.params === 'undefined' ? {} : config.params;
    }
    if (typeof initialConfig.headers === 'undefined') {
      initialConfig.headers =
        typeof config.headers === 'undefined' ? {} : config.headers;
    }

    initialConfig.headers = {...this.default.headers, ...initialConfig.headers};

    if (typeof this.options.onRequest !== 'undefined') {
      initialConfig = this.options.onRequest.apply(this, [initialConfig]);
    }

    const gate = new Xetch(this.$axios, initialConfig, this[method], config);
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
