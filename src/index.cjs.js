import {install} from './function/install';
import {useApi} from './function/inject';
import {gql} from './function/graphqlTag';

export default {
  version: '__VERSION__',
  install,
  useApi,
  gql
};
