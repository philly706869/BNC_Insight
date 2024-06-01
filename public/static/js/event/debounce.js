export const debounce = (delay, callback) => {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      callback(...args);
    }, delay);
  };
};
