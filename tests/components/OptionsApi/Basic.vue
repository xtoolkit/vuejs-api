<template>
  <div class="view">
    <div v-if="users.loading">users loading</div>
    <div v-else-if="users.error">error: {{ users.errordata }}</div>
    <div v-else>page: {{ users.pagination.page }}</div>
  </div>
  <div class="view2">
    <div v-if="pre.loading">pre loading</div>
    <div v-else-if="pre.error">error: {{ pre.errordata }}</div>
    <div v-else>data: {{ pre.data }}</div>
  </div>
</template>

<script>
  export default {
    name: 'Test',
    api: {
      pre: {},
      users: {
        method: 'user/list'
      }
    }
  };
</script>
