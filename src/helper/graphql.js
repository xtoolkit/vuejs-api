import {reactiveToStatic} from './utils';

export default function (config) {
  const options = this.options.graphql;
  const onResponse = function (data) {
    if (typeof data.errors !== 'undefined' && data.errors.length > 0) {
      this.error = true;
      this.errordata = data.errors;
      return false;
    }
    if (typeof options.onResponse !== 'undefined') {
      options.onResponse.apply(this, [reactiveToStatic(data)]);
    }
    if (this.data === null) {
      this.data = data;
    }
    if (typeof config.onResponse === 'undefined') {
      return false;
    }
    config.onResponse.apply(this, [reactiveToStatic(this.data)]);
  };

  return {
    method: 'post',
    url:
      options.client[
        config.client || options.default || Object.keys(options.client)[0]
      ],
    params: {
      operationName: null,
      variables: config.params,
      query: config.query
    },
    pagination: config.pagination || undefined,
    default: config.default || undefined,
    onResponse
  };
}
