export function throttle(delay, callback) {
  let timer = null;
  return function (...args) {
    if (timer) return;
    callback(...args);
    timer = setTimeout(() => {
      timer = null;
    }, delay);
  };
}
