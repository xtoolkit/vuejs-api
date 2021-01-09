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
    data: () => ({
      page: 3,
      method: 'user/list'
    }),
    api: {
      users: {
        method() {
          return this.method;
        },
        params() {
          return {
            pagination: {
              page: this.page
            }
          };
        }
      }
    },
    methods: {
      changePage() {
        this.page = 8;
        this.users.$refresh();
      }
    }
  };
</script>
