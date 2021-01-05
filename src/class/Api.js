import axios from 'axios';
import {ref} from 'vue';
import {Xetch} from './Xetch';
import graphql from '../function/graphql';

export class Api {
  constructor(ver, options) {
    this.ver = ver;
    this.init = false;
    this.ctx = {};
    this.options = options;
    this.methods = {
      manual: config => config,
      graphql: graphql.bind(this)
    };
    this.$axios = axios.create(this.options.axios || {});
    this.$axios.CancelToken = axios.CancelToken;
    this.$axios.isCancel = axios.isCancel;
  }

  updateVueContext(ctx) {
    this.ctx = ctx;
    this.init = true;
  }

  updateMethods(methods) {
    for (const method in methods) {
      this.methods[method] = methods[method].bind(this);
    }
  }

  createContext() {
    const context = {
      data: null,
      loading: true,
      appending: false,
      error: false,
      errordata: null,
      status: -1,
      cancel: () => {}
    };
    return this.ver === 3 ? ref(context) : context;
  }

  gate(method, config, mode) {
    if (/^graphql[/:]/.test(method)) {
      config.client = method.replace(/^graphql[/:]/, '');
      method = 'graphql';
    }

    const gate = new Xetch({
      ver: this.ver,
      axios: this.$axios,
      api: this.methods[method],
      config,
      globalConfig: this.options.default || {},
      context: this.createContext()
    });

    if (mode === 'promise') {
      return gate.request();
    } else if (mode === 'fetch') {
      return gate.request(true);
    } else if (mode === 'initial') {
      return gate.initial(config.initial || {});
    }
  }

  get wrapper() {
    const o = {
      promise: (method, config = {}) => this.gate(method, config, 'promise'),
      fetch: (method, config = {}) => this.gate(method, config, 'fetch'),
      initial: (method, config = {}) => this.gate(method, config, 'initial')
    };
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
      o.instance = this;
    }
    return o;
  }
}
