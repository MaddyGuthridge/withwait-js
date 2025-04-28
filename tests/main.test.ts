import { describe, expect, it } from 'vitest';
import { waitSync, wait } from '../src';

/** Synchronous sleep */
function sleepSync(ms: number) {
  const end = Date.now() + ms;
  while (Date.now() < end) { /* Empty */ }
}

/** Async sleep */
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Returns array of sensible amounts of time that could have been spent while waiting.
 *
 * This allows us to have a bit of a buffer in the times, accounting for performance differences.
 */
function sensibleWaitTime(ms: number): number[] {
  return [ms - 1, ms, ms + 1, ms + 2];
}

describe('sync', () => {
  it('Waits the required amount of time', () => {
    const start = Date.now();
    waitSync(() => { }, 10);
    expect(Date.now() - start).toBeOneOf(sensibleWaitTime(10));
  });

  it('Only waits the required remaining time', () => {
    const start = Date.now();
    waitSync(() => sleepSync(5), 10);
    expect(Date.now() - start).toBeOneOf(sensibleWaitTime(10));
  });

  it('Returns with no additional wait if the callback runs beyond the allotted time', () => {
    const start = Date.now();
    waitSync(() => sleepSync(10), 5);
    expect(Date.now() - start).toBeOneOf(sensibleWaitTime(10));
  });

  it('Produces the return value', () => {
    expect(waitSync(() => 42, 0)).toStrictEqual(42);
  });

  it('Throws an exception if the given function fails', () => {
    expect(() => waitSync(() => { throw Error('Some error'); }, 0)).toThrow('Some error');
  });

  it('Waits even if an exception is thrown', () => {
    const start = Date.now();
    try {
      waitSync(() => { throw Error('Nope'); }, 10);
    } catch { /* Empty */ }
    expect(Date.now() - start).toBeOneOf(sensibleWaitTime(10));
  });

  it('Throws the same exception', () => {
    const exc = Error('Some error');
    try {
      waitSync(() => { throw exc; }, 0);
      expect.fail('Should have thrown');
    } catch (thrown) {
      expect(thrown).toBe(exc);
    }
  });
});

describe('async', () => {
  it('Waits the required amount of time', async () => {
    const start = Date.now();
    await wait(async () => { }, 10);
    expect(Date.now() - start).toBeOneOf(sensibleWaitTime(10));
  });

  it('Only waits the required remaining time', async () => {
    const start = Date.now();
    await wait(() => sleep(5), 10);
    expect(Date.now() - start).toBeOneOf(sensibleWaitTime(10));
  });

  it('Returns with no additional wait if the callback runs beyond the allotted time', async () => {
    const start = Date.now();
    await wait(() => sleep(10), 5);
    expect(Date.now() - start).toBeOneOf(sensibleWaitTime(10));
  });

  it('Produces the return value', async () => {
    await expect(wait(() => Promise.resolve(42), 0)).resolves.toStrictEqual(42);
  });

  it('Produces the return value even if function was synchronous', async () => {
    await expect(wait(() => 42, 0)).resolves.toStrictEqual(42);
  });

  it('Throws an exception if the given function fails', async () => {
    await expect(() => wait(() => Promise.reject(Error('Some error')), 0)).rejects.toBeInstanceOf(Error);
  });

  it('Waits even if an exception is thrown', async () => {
    const start = Date.now();
    try {
      await wait(() => Promise.reject(Error('Some error')), 10);
    } catch { /* Empty */ }
    expect(Date.now() - start).toBeOneOf(sensibleWaitTime(10));
  });

  it('Throws the same exception', async () => {
    const exc = Error('Some error');
    try {
      await wait(() => { throw exc; }, 0);
      expect.fail('Should have thrown');
    } catch (thrown) {
      expect(thrown).toBe(exc);
    }
  });
});
