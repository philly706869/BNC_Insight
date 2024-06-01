export const throttle = (delay, callback) => {
  let timer = null;
  return (...args) => {
    if (timer) return;
    callback(...args);
    timer = setTimeout(() => {
      timer = null;
    }, delay);
  };
};
