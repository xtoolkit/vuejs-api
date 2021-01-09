import {plugin, methods, fetchWait} from '../helper';
import Basic from '../components/OptionsApi/Basic';
import Config from '../components/OptionsApi/Config';
import Reactive from '../components/OptionsApi/Reactive';

describe('options api components test', () => {
  it('basic', async () => {
    const wrapper = plugin(Basic, {
      methods
    });
    expect(wrapper.find('.view2').text()).toBe('pre loading');
    expect(wrapper.find('.view').text()).toBe('users loading');
    await fetchWait(wrapper.vm.users);
    expect(wrapper.find('.view').text()).toBe('page: 0');
  });

  it('withConfig', async () => {
    const wrapper = plugin(Config, {
      methods
    });
    expect(wrapper.find('.view').text()).toBe('users loading');
    await fetchWait(wrapper.vm.users);
    expect(wrapper.find('.view').text()).toBe('page: 2');
  });

  it('unReactive', async () => {
    const wrapper = plugin(Reactive, {
      methods
    });
    expect(wrapper.find('.view').text()).toBe('users loading');
    await fetchWait(wrapper.vm.users);
    wrapper.vm.changePage();
    await fetchWait(wrapper.vm.users);
    expect(wrapper.find('.view').text()).toBe('page: 8');
  });

  it('cancel on unmount event', async () => {
    let hook = false;
    const wrapper = plugin(Basic, {
      methods,
      default: {
        onCancel() {
          hook = true;
        }
      }
    });
    expect(wrapper.find('.view2').text()).toBe('pre loading');
    await fetchWait(wrapper.vm.users, true, wrapper.unmount());
    expect(hook).toBe(true);
  });
});
// add graphql
