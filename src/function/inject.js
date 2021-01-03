import {inject} from 'vue';

export function useApi() {
  return inject('api');
}
