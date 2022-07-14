// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...argsx: any[]) => void>(callback: T, delay = 500) {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
