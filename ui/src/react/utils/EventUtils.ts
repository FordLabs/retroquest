import { ChangeEventHandler, KeyboardEvent, KeyboardEventHandler } from 'react';

export function onChange<T = Element>(callback: (value: unknown) => void): ChangeEventHandler<T> {
  return (event) => {
    // @ts-ignore
    callback(event.target.value);
  };
}

export function onKeys<T = Element>(
  keys: string | string[],
  callback: (event: KeyboardEvent<T>) => void
): KeyboardEventHandler<T> {
  const listOfKeys = Array.isArray(keys) ? keys : [keys];

  return (e) => {
    if (listOfKeys.includes(e.key)) {
      callback(e);
    }
  };
}

export function onEachKey<T = Element>(
  keyMap: Record<string, (event: KeyboardEvent<T>) => void>
): KeyboardEventHandler<T> {
  return (e) => {
    const callback = keyMap[e.key];
    if (callback) {
      callback(e);
    }
  };
}
