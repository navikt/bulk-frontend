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
