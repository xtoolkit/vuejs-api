import {install} from './vue/install';
import {useApi} from './vue/inject';
import {gql} from './graphql/tag';

export default {
  version: '__VERSION__',
  install,
  useApi,
  gql
};
