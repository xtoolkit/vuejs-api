import {plugin, methods} from '../helper';
import InstallPlugin from '../components/InstallPlugin';
import {apiSetByVersion} from '../../src/vue/install';

describe('prepair test', () => {
  it('plugin install', () => {
    const {vm} = plugin(InstallPlugin);
    expect(vm.install).toBe('Vuejs-api installed!');
  });

  it('plugin install in vue2', () => {
    function mixin() {}
    mixin.mixin = function () {};
    apiSetByVersion(2, mixin, {mixin});
    expect(true).toBe(true);
  });

  it('plugin install other vue version', () => {
    let msg = '';
    try {
      apiSetByVersion(1, null, null);
    } catch (e) {
      msg = e.message;
    }
    expect(msg).toBe(
      '[Vuejs-Api] Error: This plugin only works in Vue 2 and 3'
    );
  });

  it('plugin install with options', () => {
    const options = {
      test: 2
    };
    const {vm} = plugin(InstallPlugin, options);
    expect(vm.plugin.instance.options).toBe(options);
  });

  it('set manual methods', () => {
    const options = {
      methods: {
        'user/list': () => ({})
      }
    };
    const {vm} = plugin(InstallPlugin, options);
    expect(typeof vm.plugin.instance.methods['user/list']).toBe('function');
  });

  it('set methods from directory', () => {
    const options = {
      methods
    };
    const {vm} = plugin(InstallPlugin, options);
    expect(typeof vm.plugin.instance.methods['user/list']).toBe('function');
  });
});
