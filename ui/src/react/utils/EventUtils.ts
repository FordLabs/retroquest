import { ChangeEventHandler, KeyboardEvent as ReactKeyboardEvent } from 'react';

export function onChange<T = Element>(callback: (value: unknown) => void): ChangeEventHandler<T> {
  return (event) => {
    // @ts-ignore
    callback(event.target.value);
  };
}

type KeyEvent = KeyboardEvent | ReactKeyboardEvent;

export function onKeys<T extends KeyEvent>(keys: string | string[], callback: (event: T) => void): (event: T) => void {
  const listOfKeys = Array.isArray(keys) ? keys : [keys];

  return (e) => {
    if (listOfKeys.includes(e.key)) {
      callback(e);
    }
  };
}

export function onEachKey<T extends KeyEvent>(keyMap: Record<string, (event: T) => void>): (event: T) => void {
  return (e) => {
    const callback = keyMap[e.key];
    if (callback) {
      callback(e);
    }
  };
}
