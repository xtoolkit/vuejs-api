import {reactiveToStatic} from '../helper/utils';

export class Xetch {
  constructor($axios, initial, update, config) {
    this.$axios = $axios;
    this.error = false;
    this.errordata = null;
    this.status = -1;
    this.load = false;
    this.paging = false;
    this.config = config;
    this.self = {
      arg1: {},
      arg2: {},
      update
    };
    this.intitalConfig(initial);
  }

  updateArgs() {
    if (this.self.method === 'get') {
      this.self.arg1.params = this.self.params || {};
      this.self.arg1.headers = this.self.headers || {};
      if (Object.keys(this.self.arg1.headers).length === 0) {
        this.self.arg1.headers = undefined;
      }
    } else {
      this.self.arg1 = this.self.params || {};
      this.self.arg2.headers = this.self.headers || {};
      if (Object.keys(this.self.arg2.headers).length === 0) {
        this.self.arg2.headers = undefined;
      }
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
      this.onResponse = res => {
        if (typeof data.onResponse === 'undefined') {
          this.data = res;
          return false;
        }
        data.onResponse.apply(this, [res]);
      };
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
    if (typeof config.params === 'undefined') {
      config.params = {};
    }
    if (typeof config.headers === 'undefined') {
      config.headers = {};
    }
    this.config = config;
    const data = reactiveToStatic(this.self.update(config));
    this.intitalConfig(data, true);
  }

  $fetch() {
    this.normalFetch();
    return this;
  }

  async fetch() {
    await this.asyncFetch();
    return this;
  }

  errorHanlde(e) {
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
    return {
      data,
      status
    };
  }

  prepairCancel() {
    const die = this.$axios.CancelToken.source();
    this.self[this.self.method === 'get' ? 'arg1' : 'arg2'].cancelToken =
      die.token;
    this.cancel = die.cancel;
  }

  normalFetch() {
    this.prepairCancel();
    this.$axios[this.self.method](this.self.url, this.self.arg1, this.self.arg2)
      .then(req => {
        this.status = req.status;
        this.onResponse(req.data);
        this.load = true;
        this.paging = false;
      })
      .catch(e => {
        this.load = true;
        this.paging = false;
        this.error = true;
        const ex = this.errorHanlde(e);
        this.errordata = ex.data;
        this.status = ex.status;
      });
  }

  async asyncFetch() {
    this.prepairCancel();
    try {
      const req = await this.$axios[this.self.method](
        this.self.url,
        this.self.arg1,
        this.self.arg2
      );
      this.status = req.status;
      this.onResponse(req.data);
      this.load = true;
    } catch (e) {
      this.error = true;
      const ex = this.errorHanlde(e);
      this.errordata = ex.data;
      this.status = ex.status;
    }
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
    await this.asyncFetch();
  }

  $getPage(i, append = false) {
    this._getPage(i, append);
    this.normalFetch();
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
