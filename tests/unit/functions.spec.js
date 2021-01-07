import {plugin, methods, fetchWait} from '../helper';
import {hotReload} from '../../src/function/utils';
import InstallPlugin from '../components/InstallPlugin';
const {vm} = plugin(InstallPlugin, {
  methods
});

describe('other Api function test', () => {
  it('hot reload', () => {
    let called = false;
    hotReload(
      {
        accept: (a, b) => {
          b();
          called = true;
        }
      },
      true,
      () => {}
    );
    expect(called).toBe(true);
  });

  it('manual', async () => {
    let params;
    let single;
    const req = await vm.$api.promise('manual', {
      url: 'https://cloudflare.com/cdn-cgi/trace',
      params: {
        rd: 123
      },
      onRequest() {
        params = this.params.rd;
        single = this.preConfigs.update
          ? this.preConfigs.update.test
          : undefined;
      },
      onResponse(data) {
        this.data = {
          msg: data
        };
      }
    });
    expect(req.value.error).not.toBe(true);
    expect(req.value.status).toBe(200);
    expect(params).toBe(123);
    expect(typeof typeof req.value.data.msg).toBe('string');
    req.value.updateConfig({
      params: {
        rd: 345
      }
    });
    await req.value.refresh();
    expect(params).toBe(345);
    req.value.updateConfig({
      test: 123
    });
    await req.value.refresh();
    expect(single).toBe(123);
  });

  it('initial method check', async () => {
    const req = vm.$api.initial('user/list', {
      params: {
        pagination: {
          page: 0
        }
      },
      initial: {
        data: {
          pages: 666,
          items: [
            {
              id: 777
            }
          ]
        },
        status: 200
      }
    });
    expect(req.value.error).not.toBe(true);
    expect(req.value.status).toBe(200);
    expect(req.value.pagination.page).toBe(0);
    expect(req.value.data.pages).toBe(666);
    expect(req.value.data.items[0].id).toBe(777);
    await req.value.pagination.append();
    expect(req.value.pagination.page).toBe(1);
  });

  it('initial method with empty input', () => {
    const req = vm.$api.initial('user/list', {
      params: {
        pagination: {
          page: 0
        }
      }
    });
    expect(req.value.pagination.page).toBe(0);
    const req2 = vm.$api.initial('user/list');
    expect(req2.value.data.pages).toBe(1);
  });
});

describe('Xetch async tools', () => {
  it('promise methods', async () => {
    const req = await vm.$api.promise('user/list', {
      params: {
        pagination: {
          page: 3
        }
      }
    });
    expect(req.value.pagination.page).toBe(3);
    await req.value.pagination.next();
    expect(req.value.pagination.page).toBe(4);
    await req.value.pagination.append();
    expect(req.value.pagination.page).toBe(5);
    expect(req.value.data.items.length).toBe(40);
    await req.value.pagination.prev();
    expect(req.value.pagination.page).toBe(4);
    expect(req.value.data.items.length).toBe(20);
    await req.value.pagination.getPage(2);
    expect(req.value.pagination.page).toBe(2);
    await req.value.refresh();
    expect(req.value.pagination.page).toBe(2);
  });

  it('Xetch sync tools', async () => {
    const req = await vm.$api.promise('user/list', {
      params: {
        pagination: {
          page: 3
        }
      }
    });
    expect(req.value.pagination.page).toBe(3);
    req.value.pagination.$next();
    await fetchWait(req.value);
    expect(req.value.pagination.page).toBe(4);
    req.value.pagination.$append();
    await fetchWait(req.value);
    expect(req.value.pagination.page).toBe(5);
    expect(req.value.data.items.length).toBe(40);
    req.value.pagination.$prev();
    await fetchWait(req.value);
    expect(req.value.pagination.page).toBe(4);
    expect(req.value.data.items.length).toBe(20);
    req.value.pagination.$getPage(2);
    await fetchWait(req.value);
    expect(req.value.pagination.page).toBe(2);
    req.value.$refresh(2);
    await fetchWait(req.value);
    expect(req.value.pagination.page).toBe(2);
  });
});
