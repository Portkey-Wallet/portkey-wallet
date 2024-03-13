import { randomId } from './';

const timeWorker: { [key: string]: NodeJS.Timeout } = {};

export function setTimeoutInterval(callback: () => void, time: number) {
  const key = randomId();
  const execute = function (executeFn: () => void, executeTime: number) {
    timeWorker[key] = setTimeout(() => {
      callback();
      execute(executeFn, executeTime);
    }, time);
  };
  execute(callback, time);
  return key;
}

export function clearTimeoutInterval(key: string) {
  if (key in timeWorker) {
    clearTimeout(timeWorker[key]);
    delete timeWorker[key];
  }
}
