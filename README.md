# Withwait

Ensure operations involving sleeping always complete, even if an exception
occurs during execution.

## Motivation

When testing flaky code, failure to wait for timeouts to resolve before moving
onto the next test can cause crashes and confusing test failures. Obviously,
it'd be best to fix the flakiness, but if you're testing someone else's work
(eg when auto-marking COMP1531), that may not be an option.

If you want to have a certain operation always take a consistent amount of
time, eg to prevent timing attacks on login systems, this could be used to
delay sending a response to a request with incorrect credentials.

## Installation

`npm install withwait` (optionally `--save-dev` if you're just using it for
testing).

## Usage

```js
import { wait } from 'withwait';

const result = await wait(() => {
    // Do some operation
}, 1000);

// At this point, at least 1000 ms is guaranteed to have passed
```

Even if an error is thrown, the time will still pass.

```js
import { wait } from 'withwait';

try {
    await wait(() => {
        throw Error('Uh oh!');
    }, 1000);
    // The error wasn't silenced, so after 1000ms it'll be thrown again and
    // jump to the `catch` block.
} catch (e) {
    // 1000 ms has passed
    console.log('Error was caught:', e);
}
```

There is also a synchronous version of the function. It blocks the event loop,
so you probably shouldn't use it unless you really need to, but it does work.

```js
import { waitSync } from 'withwait';

const result = waitSync(() => {}, 1000);
```
