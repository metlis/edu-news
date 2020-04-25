const utils = (function () {
  function sortByParam(paramName) {
    return function (a, b) {
      if (a[paramName] < b[paramName]) {
        return -1;
      }
      if (a[paramName] > b[paramName]) {
        return 1;
      }
      return 0;
    };
  }

  function sortByDate(paramName) {
    return function (a, b) {
      return new Date(b[paramName]) - new Date(a[paramName]);
    };
  }

  return {
    sortByParam,
    sortByDate,
  };
}());
export default utils;
