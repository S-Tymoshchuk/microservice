export function DynamicSort(data, prop, isAsc) {
  return data.sort((a, b) => {
    return (
      (a[prop] < b[prop] ? -1 : 1) * (isAsc?.toLowerCase() === 'asc' ? 1 : -1)
    );
  });
}
