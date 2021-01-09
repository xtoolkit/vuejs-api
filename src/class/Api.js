import axios from 'axios';
import {ref} from 'vue';
import {Xetch} from './Xetch';
import graphql from '../graphql/method';

export class Api {
  constructor(ver, options) {
    this.ver = ver;
    this.init = false;
    this.app = {};
    this.options = options;
    this.methods = {
      manual: config => config,
      graphql: graphql.bind(this)
    };
    this.$axios = axios.create(this.options.axios || {});
    this.$axios.CancelToken = axios.CancelToken;
    this.$axios.isCancel = axios.isCancel;
  }

  setAppContext(ctx) {
    this.app = ctx;
    this.init = true;
  }

  updateMethods(methods) {
    for (const method in methods) {
      this.methods[method] = methods[method].bind(this);
    }
  }

  createRes(reactive = true) {
    const context = {
      data: null,
      loading: true,
      error: false,
      errordata: null,
      status: -1,
      cancel: () => {}
    };
    return this.ver === 3 && reactive ? ref(context) : context;
  }

  gate(method, config, mode) {
    if (/^graphql[/:]/.test(method)) {
      config.client = method.replace(/^graphql[/:]/, '');
      method = 'graphql';
    }

    const gate = new Xetch(
      this.ver,
      this.$axios,
      this.methods[method],
      config,
      this.options.default || {},
      this.vue,
      this.createRes()
    );

    if (mode === 'initial') {
      return gate.initial(config.initial || {});
    }
    return gate.request(mode === 'promise');
  }

  get wrapper() {
    const o = {};
    ['promise', 'fetch', 'initial'].forEach(mode => {
      o[mode] = (method, config = {}) => this.gate(method, config, mode);
    });
    if (process.env.NODE_ENV === 'test') {
      o.instance = this;
    }
    return o;
  }
}
