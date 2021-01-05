import {plugin, gql, fetchWait} from '../helper';
import Basic from '../components/GraphQL/Basic';
import Operation from '../components/GraphQL/Operation';
import InstallPlugin from '../components/InstallPlugin';

const options = {
  graphql: {
    client: {
      almansi: 'https://graphqlzero.almansi.me/api',
      solar: 'https://demo.saleor.io/graphql/'
    }
  }
};

describe('graphql test', () => {
  it('basic', async () => {
    const wrapper = plugin(Basic, options);
    expect(wrapper.find('.view').text()).toBe('users loading');
    await fetchWait(wrapper.vm.req);
    expect(wrapper.find('.view').text()).toBe('id: 1');
  });

  it('unReactive', async () => {
    const wrapper = plugin(Operation, options);
    expect(wrapper.find('.view').text()).toBe('users loading');
    await fetchWait(wrapper.vm.req);
    wrapper.vm.changeOperation();
    expect(wrapper.vm.operation).toBe('posts');
    await fetchWait(wrapper.vm.req);
    expect(wrapper.find('.view').text()).toBe('id: 1');
  });

  it('select other definded endpoint', async () => {
    const {vm} = plugin(InstallPlugin, options);
    const req = await vm.$api.promise('graphql/solar', {
      query: gql`
        query {
          shop {
            name
          }
        }
      `
    });
    expect(req.value.data.data.shop.name).toBe('Saleor e-commerce');
  });

  it('select other undefinded endpoint', async () => {
    const {vm} = plugin(InstallPlugin);
    const req = await vm.$api.promise(
      'graphql:https://countries.trevorblades.com/',
      {
        query: gql`
          query($code: ID!) {
            country(code: $code) {
              capital
            }
          }
        `,
        params: {
          code: 'IR'
        }
      }
    );
    expect(req.value.data.data.country.capital).toBe('Tehran');
  });
});
