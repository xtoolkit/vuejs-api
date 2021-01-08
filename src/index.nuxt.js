import {getMethods, hotReload} from './utils';
import {useApi} from './vue/inject';
import {gql} from './graphql/tag';
import {Api} from './class/Api';
import mixin from './vue/mixin';

export default Api;
export const version = '__VERSION__';

export {mixin, getMethods, useApi, gql, hotReload};
