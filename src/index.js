import {install} from './vue/install';
import {useApi} from './vue/inject';
import {gql} from './graphql/tag';

install.version = '__VERSION__';

export default install;

export {useApi, gql};
