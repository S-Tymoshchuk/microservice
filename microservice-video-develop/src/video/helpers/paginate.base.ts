export const paginateBase = (query) => {
  const { pageSize, page } = query || {};

  const limit = Number(pageSize || 1000);
  const offset = limit * Number(page >= 1 ? Number(query.page - 1) : 0);
  return { offset, limit };
};
