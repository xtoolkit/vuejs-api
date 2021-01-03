import axios from 'axios';
import {ref} from 'vue';
import {Xetch} from './Xetch';
import graphql from '../function/graphql';

export class Api {
  constructor(options, ctx) {
    this.ctx = ctx._context;
    this.options = options;
    this.methods = {
      manual: config => config,
      graphql: config => graphql.apply(this, [config])
    };
    this.setupAxios();
  }

  setupAxios() {
    this.$axios = axios.create(this.options.axios || {});
    this.$axios.CancelToken = axios.CancelToken;
    this.$axios.isCancel = axios.isCancel;
  }

  updateMethods(methods) {
    for (const method in methods) {
      this.methods[method] = config => methods[method].apply(this, [config]);
    }
  }

  manual(config) {
    return config;
  }

  createContext() {
    return ref({
      data: null,
      loading: true,
      appending: false,
      error: false,
      errordata: null,
      status: -1,
      cancel: () => {}
    });
  }

  gate(method, config, mode) {
    if (/^graphql[/:]/.test(method)) {
      config.client = method.replace(/^graphql[/:]/, '');
      method = 'graphql';
    }

    const gate = new Xetch({
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

  promise(method, config = {}) {
    return this.gate(method, config, 'promise');
  }

  fetch(method, config = {}) {
    return this.gate(method, config, 'fetch');
  }

  initial(method, config = {}) {
    return this.gate(method, config, 'initial');
  }
}
