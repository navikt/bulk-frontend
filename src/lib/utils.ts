import Papa from "papaparse";
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

export function parseCSV(string: string) {
  return Papa.parse(string, {
    header: false,
    delimitersToGuess: [",", "\t", "|", ";", Papa.RECORD_SEP, Papa.UNIT_SEP, ""],
    skipEmptyLines: true,
  }).data as string[][];
}

// Given a cookie key `name`, returns the value of
// the cookie or `null`, if the key is not found.
export function getCookie(name: string): string | null {
  const nameLenPlus = name.length + 1;
  return (
    document.cookie
      .split(";")
      .map((c) => c.trim())
      .filter((cookie) => {
        return cookie.substring(0, nameLenPlus) === `${name}=`;
      })
      .map((cookie) => {
        return decodeURIComponent(cookie.substring(nameLenPlus));
      })[0] || null
  );
}
