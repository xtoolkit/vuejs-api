import {install} from './function/install';
import {getMethods} from './function/utils';
import {useApi} from './function/inject';
import {gql} from './function/graphqlTag';

export default {
  install,
  getMethods,
  useApi,
  gql
};

export {getMethods, useApi, gql};
