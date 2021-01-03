import {plugin, methods} from '../helper';
import InstallPlugin from '../components/InstallPlugin';
import {hotReload} from '../../src/function/install';

describe('prepair test', () => {
  it('plugin install', () => {
    const {vm} = plugin(InstallPlugin);
    expect(vm.install).toBe('Vuejs-api installed!');
  });

  it('plugin install with options', () => {
    const options = {
      test: 2
    };
    const {vm} = plugin(InstallPlugin, options);
    expect(vm.plugin.options).toBe(options);
  });

  it('set manual methods', () => {
    const options = {
      methods: {
        'user/list': () => ({})
      }
    };
    const {vm} = plugin(InstallPlugin, options);
    expect(typeof vm.plugin.methods['user/list']).toBe('function');
  });

  it('set methods from directory', () => {
    const options = {
      methods
    };
    const {vm} = plugin(InstallPlugin, options);
    expect(typeof vm.plugin.methods['user/list']).toBe('function');
  });

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
});
