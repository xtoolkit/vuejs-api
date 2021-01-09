import {plugin, fetchWait, methods} from '../helper';
import InstallPlugin from '../components/InstallPlugin';

const url = 'https://gorest.co.in/public-api/posts';
const trust = data => data.meta.pagination.page;

describe('single target hooks', () => {
  it('set hooks from plugin', async () => {
    let onRequest = false;
    let onResponse = false;
    const options = {
      methods,
      default: {
        onRequest() {
          onRequest = this.config.url;
        },
        onResponse(data) {
          onResponse = trust(data);
        }
      }
    };
    const {vm} = plugin(InstallPlugin, options);
    await vm.$api.promise('user/list');
    expect(onRequest).toBe(url);
    expect(onResponse).toBe(1);
  });

  it('set hooks from components', async () => {
    let onRequest = false;
    let onResponse = false;
    const options = {
      methods
    };
    const {vm} = plugin(InstallPlugin, options);
    await vm.$api.promise('user/list', {
      onRequest() {
        onRequest = this.config.url;
      },
      onResponse(data) {
        onResponse = trust(data);
      }
    });
    expect(onRequest).toBe(url);
    expect(onResponse).toBe(1);
  });

  it('set hooks from methods', async () => {
    let onRequest = false;
    let onResponse = false;
    const options = {
      methods: {
        'user/list'() {
          return {
            method: 'get',
            url,
            onRequest() {
              onRequest = this.config.url;
            },
            onResponse(data) {
              onResponse = trust(data);
            }
          };
        }
      }
    };
    const {vm} = plugin(InstallPlugin, options);
    await vm.$api.promise('user/list');
    expect(onRequest).toBe(url);
    expect(onResponse).toBe(1);
  });

  it('set multiple state hooks', async () => {
    let onRequest = 'initial';
    let onResponse = 'initial';
    const options = {
      methods: {
        'user/list'() {
          return {
            method: 'get',
            url,
            onRequest() {
              onRequest = onRequest === 'component' ? 'method' : '';
            },
            onResponse() {
              onResponse = onResponse === 'component' ? 'method' : '';
            }
          };
        }
      },
      default: {
        onRequest() {
          onRequest = onRequest === 'initial' ? 'plugin' : '';
        },
        onResponse() {
          onResponse = onResponse === 'initial' ? 'plugin' : '';
        }
      }
    };
    const {vm} = plugin(InstallPlugin, options);
    await vm.$api.promise('user/list', {
      onRequest() {
        onRequest = onRequest === 'plugin' ? 'component' : '';
      },
      onResponse() {
        onResponse = onResponse === 'plugin' ? 'component' : '';
      }
    });
    expect(onRequest).toBe('method');
    expect(onResponse).toBe('method');
  });
});

describe('http hooks', () => {
  const {vm} = plugin(InstallPlugin);

  it('set onDownloadProgress', async () => {
    let progress = 0;
    const req = vm.$api.fetch('manual', {
      url: 'https://httpbin.org/image/jpeg',
      onDownloadProgress(e) {
        progress = (e.loaded * 100) / e.total;
      }
    });
    await fetchWait(req.value);
    expect(progress).toBe(100);
  });

  it('set onUploadProgress', async () => {
    let progress = 0;
    const params = {};
    for (let i = 0; i < 1000; i++) {
      params['params_' + i] = 'test';
    }
    const req = vm.$api.fetch('manual', {
      method: 'post',
      params,
      url: 'https://httpbin.org/response-headers',
      onUploadProgress() {
        progress++;
      }
    });
    await fetchWait(req.value);
    expect(progress).not.toBe(0);
  });
});

// hook in update?
