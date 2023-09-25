import { type Out } from "./types";

export interface IOut {
  out: Out;
  getStdout: () => unknown[][];
}

export function factoryOut(): IOut {
  const stdout: unknown[][] = [];

  function out(...data: unknown[]): void {
    stdout.push(data);
  }

  return { out, getStdout: () => stdout };
}
