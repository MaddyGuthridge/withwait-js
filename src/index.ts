function sleepUntilSync(end: number) {
  while (Date.now() < end) { /* Empty */ }
}

function sleepUntilAsync(end: number) {
  const ms = end - Date.now();
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function waitSync<T>(callback: () => T, ms: number): T {
  const end = Date.now() + ms;
  try {
    const result = callback();
    sleepUntilSync(end);
    return result;
  } catch (e) {
    sleepUntilSync(end);
    throw e;
  }
}

export async function wait<T>(callback: () => Promise<T>, ms: number): Promise<T> {
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
