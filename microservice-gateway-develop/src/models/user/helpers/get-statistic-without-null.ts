export const WithoutNull = (statistic) => {
  const result = {};
  Object.entries(statistic).forEach(([key, value]) => {
    Object.values(value).filter((el) => {
      if (el > 0) {
        result[key] = statistic[key];
      }
    });
  });
  return result;
};
