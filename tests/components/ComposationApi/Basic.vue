<template>
  <div class="view">
    <div v-if="users.loading">users loading</div>
    <div v-else-if="users.error">error: {{ users.errordata }}</div>
    <div v-else>page: {{ users.pagination.page }}</div>
  </div>
</template>

<script>
  import {useApi} from '../../helper';
  export default {
    setup() {
      const {fetch} = useApi();
      const users = fetch('user/list');
      return {
        users
      };
    }
  };
</script>
