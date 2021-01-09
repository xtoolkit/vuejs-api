export default function (config) {
  const clients = this.options.graphql ? this.options.graphql.client : {};
  let url = '';
  if (config.client === '' || !config.client) {
    url = clients[Object.keys(clients)[0]];
  } else if (clients[config.client]) {
    url = clients[config.client];
  } else {
    url = config.client;
  }
  return {
    method: 'post',
    url,
    params: {
      operationName: config.operation || null,
      variables: config.params,
      query: config.query
    },
    pagination: config.pagination || undefined,
    default: config.default || undefined
  };
}
