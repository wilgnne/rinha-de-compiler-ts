export function factoryOut(): {
  out: (...data: unknown[]) => void;
  getStdout: () => unknown[][];
} {
  const stdout: unknown[][] = [];

  function out(...data: unknown[]): void {
    stdout.push(data);
  }

  return { out, getStdout: () => stdout };
}
