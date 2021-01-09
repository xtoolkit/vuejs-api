import {getMethods, hotReload} from './utils';
import {useApi} from './vue/inject';
import {Api} from './class/Api';
import mixin from './vue/mixin';
import {gql} from './graphql/tag';

export default Api;
export const version = '__VERSION__';

export {mixin, getMethods, useApi, gql, hotReload};
