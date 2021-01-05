<template>
  <div>{{ install }}</div>
</template>

<script>
  export default {
    name: 'Test',
    api: {},
    computed: {
      install() {
        return this.$api.instance.methods.manual('Vuejs-api installed!');
      },
      plugin() {
        return this.$api;
      }
    }
  };
</script>
