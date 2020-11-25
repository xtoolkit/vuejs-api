import {createLocalVue} from '@vue/test-utils';
import plugin from '../../src';

const localVue = createLocalVue();
let $api;

describe('prepair test', () => {
  it('plugin install', () => {
    localVue.use(plugin);
    $api = localVue.prototype.$api;
    expect(typeof $api).toBe('object');
  });

  it('internet status', async () => {
    const req = await $api.request('manual', {
      url: 'https://cloudflare.com/cdn-cgi/trace',
      method: 'get'
    });
    expect(req.status).toBe(200);
  });
});

describe('plugin tools test', () => {
  it('cancel method', async () => {
    const req = await $api.request('manual', {
      url: 'https://cloudflare.com/cdn-cgi/trace',
      method: 'get',
      onResponse() {
        console.log('yes');
        expect(req.status).toBe(210);
      }
    });
    console.log(req.data);
    // req.cancel();
  });
});
