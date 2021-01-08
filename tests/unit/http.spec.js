import {plugin, methods} from '../helper';
import Basic from '../components/OptionsApi/Basic';

describe('http request test', () => {
  const {vm} = plugin(Basic, {
    methods
  });

  it('basic', async () => {
    const req = await vm.$api.promise('user/list');
    expect(req.value.status).toBe(200);
    expect(req.value.error).toBe(false);
  });

  it('with options', async () => {
    const req = await vm.$api.promise('manual', {
      url: 'https://httpbin.org/basic-auth/foo/bar',
      options: {
        auth: {
          username: 'foo',
          password: 'bar'
        }
      }
    });
    expect(req.value.status).toBe(200);
    expect(req.value.error).toBe(false);
    expect(req.value.data.user).toBe('foo');
  });

  it('faild response', async () => {
    const req = await vm.$api.promise('manual', {
      url: 'https://httpbin.org/test'
    });
    expect(req.value.status).toBe(404);
    expect(req.value.error).toBe(true);
    expect(req.value.errordata.headers['content-type']).toBe('text/html');
  });

  it('faild request', async () => {
    console.error = jest.fn();
    const req = await vm.$api.promise('manual', {
      url: 'http://thisisnotaserver/foo'
    });
    expect(req.value.status).toBe(-1);
    expect(req.value.error).toBe(true);
    expect(typeof req.value.errordata).toBe('object');
  }, 9000);

  it('request timeout', async () => {
    console.error = jest.fn();
    let timeout = false;
    await vm.$api.promise('manual', {
      url: 'http://thisisnotaserver/foo',
      options: {
        timeout: 1
      },
      onTimeout() {
        timeout = true;
      }
    });
    expect(timeout).toBe(true);
  }, 9000);
});
