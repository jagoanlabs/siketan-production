import { useCallback, useEffect, useState } from "react";

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Debounced function untuk update value
  const updateDebouncedValue = useCallback(
    debounce((newValue: string) => {
      setDebouncedValue(newValue);
    }, delay),
    [delay],
  );

  useEffect(() => {
    updateDebouncedValue(value);
  }, [value, updateDebouncedValue]);

  // Set initial value immediately
  useEffect(() => {
    setDebouncedValue(value);
  }, []);

  return debouncedValue;
};
