import { MutableRefObject, RefObject, useRef } from "react";

export function useRef2<T>(initialValue: T): [T, MutableRefObject<T>];
export function useRef2<T>(initialValue: T | null): [T | null, RefObject<T>];
export function useRef2<T = undefined>(): [
  T | undefined,
  MutableRefObject<T | undefined>
];

/* eslint-disable react-hooks/rules-of-hooks */
export function useRef2<T>(
  initialValue: T | null | undefined = undefined
): any {
  if (initialValue === undefined) {
    const ref = useRef<T>();
    const current = ref.current;
    return [current, ref];
  }
  const ref = useRef<T>(initialValue);
  const current = ref.current;
  return [current, ref];
}
/* eslint-enable react-hooks/rules-of-hooks */
