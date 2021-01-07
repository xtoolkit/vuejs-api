import {install} from './function/install';
import {useApi} from './function/inject';
import {gql} from './function/graphqlTag';

install.version = '__VERSION__';

export default install;

export {useApi, gql};
