<template>
  <div>{{ install }}</div>
</template>

<script>
  export default {
    name: 'Test',
    api: {},
    computed: {
      install() {
        return this.$api.manual('Vuejs-api installed!');
      },
      plugin() {
        return this.$api;
      }
    }
  };
</script>
