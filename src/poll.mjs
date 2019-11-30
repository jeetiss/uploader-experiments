const DEFAULT_TIMEOUT = 10000;
const DEFAULT_INTERVAL = 500;

const poll = ({
  check,
  timeout = DEFAULT_TIMEOUT,
  interval = DEFAULT_INTERVAL,
  cancel
}) =>
  new Promise((resolve, reject) => {
    let timeoutId;
    const startTime = Date.now();
    const endTime = startTime + timeout;

    if (cancel) {
      cancel.onCancel(() => {
        timeoutId && clearTimeout(timeoutId);
        reject(new Error('cancel'));
      });
    }

    function tick() {
      Promise.resolve(check(cancel))
        .then(result => {
          const nowTime = Date.now();

          if (result) {
            resolve(result);
          } else if (nowTime > endTime) {
            reject(new Error("poll timeout"));
          } else {
            timeoutId = setTimeout(tick, interval);
          }
        })
        .catch(reject);
    }

    timeoutId = setTimeout(tick);
  });

export { poll };
