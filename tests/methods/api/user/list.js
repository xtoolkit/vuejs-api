export default function ({params}) {
  const page = params?.pagination.page || 1;
  return {
    method: 'get',
    url: 'https://gorest.co.in/public-api/posts',
    params: {
      page
    },
    pagination: true,
    default: {
      pages: 1,
      items: []
    },
    onResponse(data) {
      if (this.state.status !== 200) {
        return false;
      }
      data.data.forEach(item => {
        this.data.items.push(item);
      });
      this.data.pages = data.meta.pagination.pages;
    }
  };
}
