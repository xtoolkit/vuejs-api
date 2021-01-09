<template>
  <div class="view">
    <div v-if="users.loading">users loading</div>
    <div v-else-if="users.error">error: {{ users.errordata }}</div>
    <div v-else>page: {{ users.pagination.page }}</div>
  </div>
</template>

<script>
  export default {
    name: 'Test',
    api: {
      users: {
        method: 'user/list',
        params: {
          pagination: {
            page: 2
          }
        }
      }
    }
  };
</script>
