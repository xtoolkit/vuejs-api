<template>
  <div class="view">
    <div v-if="req.loading">users loading</div>
    <div v-else-if="req.error">error: {{ req.errordata }}</div>
    <div v-else>id: {{ req.data.data.users.items[0].id }}</div>
  </div>
</template>

<script>
  import {gql} from '../../helper';
  export default {
    api: {
      req: {
        method: 'graphql',
        query: gql`
          query {
            users {
              items: data {
                id
                name
              }
            }
          }
        `
      }
    }
  };
</script>
