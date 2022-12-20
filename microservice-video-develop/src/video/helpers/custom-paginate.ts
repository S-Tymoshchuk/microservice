export function CustomPaginate(array, query) {
  if (!query.page) {
    return array;
  }
  return array.slice(
    (query.page - 1) * query.pageSize,
    query.page * query.pageSize,
  );
}
