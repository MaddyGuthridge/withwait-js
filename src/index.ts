import slync from 'slync';

/** Async sleep */
function sleepUntilAsync(end: number) {
  const ms = end - Date.now();
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Call the given `callback` function, waiting for (at least) the given number of `ms` before
 * returning its result.
 *
 * This function is synchronous, meaning it will block the event loop. Only use it if you can't use
 * async code.
 *
 * - If `callback` takes less than `ms` to resolve, the remaining time will be waited
 *   synchronously before the result is returned.
 * - If `callback` takes more than `ms` to resolve, no additional time will be waited.
 * - If `callback` throws an exception, the remaining time will be waited synchronously before the
 *   exception is thrown again.
 *
 * @param callback Callback function, whose result is returned at the end of the timer.
 * @param ms Minimum time to wait (in ms)
 * @returns return value of the callback.
 */
export function waitSync<T>(callback: () => T, ms: number): T {
  try {
    const result = callback();
    slync(ms);
    return result;
  } catch (e) {
    const end = Date.now() + ms;
    sleepUntilSync(end);
    throw e;
  }
}

/**
 * Call the given `callback` function, waiting for (at least) the given number of `ms` before
 * returning the resolved promise.
 *
 * - If `callback` takes less than `ms` to resolve, the remaining time will be waited
 *   asynchronously before the result is returned.
 * - If `callback` takes more than `ms` to resolve, no additional time will be waited.
 * - If `callback` throws an exception, the remaining time will be waited asynchronously before the
 *   promise is rejected (ie the exception is thrown again).
 *
 * @param callback Callback function, whose result is returned at the end of the timer.
 * @param ms Minimum time to wait (in ms)
 * @returns return value of the callback.
 */
export async function wait<T>(callback: () => Promise<T> | T, ms: number): Promise<T> {
  const end = Date.now() + ms;
  try {
    const result = await callback();
    await sleepUntilAsync(end);
    return result;
  } catch (e) {
    await sleepUntilAsync(end);
    throw e;
  }
}
