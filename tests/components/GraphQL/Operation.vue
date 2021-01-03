<template>
  <div class="view">
    <div v-if="req.loading">{{ operation }} loading</div>
    <div v-else-if="req.error">error: {{ req.errordata }}</div>
    <div v-else>id: {{ req.data.data.list.items[0].id }}</div>
  </div>
</template>

<script>
  import {gql} from '../../helper';
  export default {
    data: () => ({
      operation: 'users'
    }),
    api: {
      req: {
        method: 'graphql',
        query: gql`
          query users {
            list: users {
              items: data {
                id
              }
            }
          }
          query posts {
            list: posts {
              items: data {
                id
              }
            }
          }
        `,
        operation() {
          return this.operation;
        }
      }
    },
    methods: {
      changeOperation() {
        this.operation = 'posts';
        this.req.$refresh();
      }
    }
  };
</script>
