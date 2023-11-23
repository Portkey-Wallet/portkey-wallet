import RaceControl from './raceControl';

export type TimeoutPromiseResult = { type: 'timeout' };

export function isTimeoutPromiseResult(r: unknown): r is TimeoutPromiseResult {
  return (r as TimeoutPromiseResult)?.type === 'timeout';
}

export const timeoutPromise = (delay?: number, c?: RaceControl) => {
  return new Promise<TimeoutPromiseResult>(_resolve => {
    const ids = setTimeout(() => {
      clearTimeout(ids);
      _resolve({ type: 'timeout' });
    }, delay);
    c?.onOnceStop(() => {
      clearTimeout(ids);
    });
  });
};
