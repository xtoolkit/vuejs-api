import {reactiveToStatic, fixContext} from '../helper/utils';

export class Xetch {
  constructor({axios, initial, method, config, options, hook}) {
    this.$axios = axios;
    this.error = false;
    this.errordata = null;
    this.status = -1;
    this.load = false;
    this.paging = false;
    this.config = config;
    this.self = {
      data: {},
      config: options,
      update: method,
      onResponse: hook.onResponse
    };
    if (hook.onUploadProgress.length > 0) {
      this.self.config.onUploadProgress = hook.onUploadProgress;
    }
    if (hook.onDownloadProgress.length > 0) {
      this.self.config.onDownloadProgress = hook.onDownloadProgress;
    }
    this.intitalConfig(initial);
  }

  get poster() {
    return ['post', 'put', 'path'].includes(this.self.method);
  }

  updateArgs() {
    const params = this.self.params || {};
    const headers = this.self.headers || undefined;
    if (this.poster) {
      this.self.data = params;
      this.self.config.headers = headers;
    } else {
      this.self.config.params = params;
      this.self.config.headers = headers;
    }
  }

  intitalConfig(data, configOnly = false) {
    this.self.method = data.method;
    this.self.url = data.url;
    this.self.params = data.params;
    this.self.headers = data.headers;
    this.self.default = data.default || null;
    if (configOnly === false) {
      this.data =
        this.self.default === null ? null : reactiveToStatic(this.self.default);
      if (typeof data.pagination !== 'undefined') {
        this.self.pagination = data.pagination;
        this.size = this.self.pagination.size.apply(this.self);
        this.index = this.self.pagination.index.apply(this.self);
      }
    } else {
      if (typeof this.self.pagination !== 'undefined') {
        this.size = this.self.pagination.size.apply(this.self);
        this.index = this.self.pagination.index.apply(this.self);
      }
    }
    this.updateArgs();
  }

  update(config = {}) {
    fixContext(['params', 'headers'], config);
    this.config = config;
    const data = reactiveToStatic(this.self.update(config));
    this.intitalConfig(data, true);
  }

  initial() {
    this.data = reactiveToStatic(this.config.initial.data);
    this.load = reactiveToStatic(this.config.initial.load || true);
    this.error = reactiveToStatic(this.config.initial.error || false);
    this.errordata = reactiveToStatic(this.config.initial.errordata || null);
    this.status = reactiveToStatic(this.config.initial.status || 200);
    return this;
  }

  prepairCancel() {
    const die = this.$axios.CancelToken.source();
    this.self.config.cancelToken = die.token;
    this.cancel = die.cancel;
  }

  onResponse(res) {
    if (this.self.onResponse.length === 0) {
      this.data = res;
      return false;
    }
    this.self.onResponse.forEach(f => {
      f.apply(this, [res]);
    });
  }

  onSeccessful({status, data}) {
    this.status = status;
    this.onResponse(data);
    this.load = true;
    this.paging = false;
  }

  onFailed(e) {
    let data = null;
    let status = -1;
    if (e.response) {
      // console.log(e.response.headers);
      status = e.response.status;
      data = e.response.data;
    } else if (e.request) {
      data = e.request;
    } else {
      data = e.message;
    }
    this.load = true;
    this.paging = false;
    this.error = true;
    this.errordata = data;
    this.status = status;
  }

  get gate() {
    return this.$axios[this.self.method](
      this.self.url,
      this.poster ? this.self.data : this.self.config,
      this.poster ? this.self.config : undefined
    );
  }

  $fetch() {
    this.prepairCancel();
    this.gate.then(res => this.onSeccessful(res)).catch(e => this.onFailed(e));
    return this;
  }

  async fetch() {
    this.prepairCancel();
    try {
      const res = await this.gate;
      console.log(res);
      this.onSeccessful(res);
    } catch (e) {
      this.onFailed(e);
    }
    return this;
  }

  // Tools
  _getPage(i, append = false) {
    this.error = false;
    if (!append) {
      this.load = false;
      this.data =
        this.self.default === null ? null : reactiveToStatic(this.self.default);
    } else {
      this.paging = true;
    }
    this.index =
      typeof this.self.pagination !== 'undefined'
        ? this.self.pagination.index.apply(this.self, [i])
        : 0;
    this.updateArgs();
  }

  async getPage(i, append = false) {
    this._getPage(i, append);
    await this.fetch();
  }

  $getPage(i, append = false) {
    this._getPage(i, append);
    this.$fetch();
  }

  async refresh() {
    await this.getPage(0);
  }

  $refresh() {
    this.$getPage(0);
  }

  async append() {
    await this.getPage(++this.index, true);
  }

  $append() {
    this.$getPage(++this.index, true);
  }

  async next() {
    await this.getPage(++this.index);
  }

  $next() {
    this.$getPage(++this.index);
  }

  async prev() {
    await this.getPage(--this.index);
  }

  $prev() {
    this.$getPage(--this.index);
  }
}

export default Xetch;
