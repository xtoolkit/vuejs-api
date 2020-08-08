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

  manual() {
    return {};
  }

  gate(method, config, asyncMode) {
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

    let methodConfig = this[method](config);

    if (typeof methodConfig.params === 'undefined') {
      methodConfig.params =
        typeof config.params === 'undefined' ? {} : config.params;
    }
    if (typeof methodConfig.headers === 'undefined') {
      methodConfig.headers =
        typeof config.headers === 'undefined' ? {} : config.headers;
    }

    methodConfig.headers = {...this.default.headers, ...methodConfig.headers};

    if (typeof this.options.onRequest !== 'undefined') {
      methodConfig = this.options.onRequest.apply(this, [methodConfig]);
    }

    const gate = new Xetch(this.$axios, methodConfig);
    if (asyncMode) {
      return gate.fetch();
    }
    return gate.$fetch();
  }

  fetch(method, config = {}) {
    return this.gate(method, config, false);
  }

  request(method, config = {}) {
    return this.gate(method, config, true);
  }
}

export default Api;
