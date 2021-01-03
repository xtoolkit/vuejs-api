import {plugin, methods, fetchWait} from '../helper';
import Basic from '../components/ComposationApi/Basic';

describe('composation api components test', () => {
  it('basic', async () => {
    const wrapper = plugin(Basic, {
      methods
    });
    expect(wrapper.find('.view').text()).toBe('users loading');
    await fetchWait(wrapper.vm.users);
    expect(wrapper.find('.view').text()).toBe('page: 0');
  });
});
