export const controlledThrottle = (callback) => {
  let timer = null;
  const interrupt = (unit, times, callback, ...args) => {
    let time = 0;
    const setUnitTimeout = () => {
      time += 1;
      if (time > times) {
        timer = null;
        return;
      }
      return setTimeout(() => {
        if (callback) callback(time, times - time, ...args);
        setUnitTimeout();
      }, unit);
    };
    callback(0, times);
    timer = setUnitTimeout();
  };
  return (...args) => {
    if (timer) return;
    callback(interrupt, ...args);
  };
};
