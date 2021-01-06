import {getMethods, hotReload} from './function/utils';
import {useApi} from './function/inject';
import {gql} from './function/graphqlTag';
import {Api} from './class/Api';
import mixin from './function/mixin';

export default Api;

export {mixin, getMethods, useApi, gql, hotReload};
