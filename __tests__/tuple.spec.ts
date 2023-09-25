import { describe, expect, test } from "vitest";
import { type IFile } from "../src/types";
import { run } from "../src/run";
import { factoryOut } from "../src/utils";

describe("tuple spec suit", () => {
  test("tuple first", () => {
    const file: IFile = {
      name: "files/hello.rinha",
      expression: {
        kind: "Print",
        value: {
          kind: "First",
          value: {
            kind: "Tuple",
            first: {
              kind: "Int",
              value: BigInt(1),
              location: { start: 13, end: 14, filename: "files/hello.rinha" },
            },
            second: {
              kind: "Int",
              value: BigInt(2),
              location: { start: 16, end: 17, filename: "files/hello.rinha" },
            },
            location: { start: 12, end: 18, filename: "files/hello.rinha" },
          },
          location: { start: 6, end: 19, filename: "files/hello.rinha" },
        },
        location: { start: 0, end: 20, filename: "files/hello.rinha" },
      },
      location: { start: 0, end: 20, filename: "files/hello.rinha" },
    };

    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["1"]]);
  });

  test("tuple second", () => {
    const file: IFile = {
      name: "files/hello.rinha",
      expression: {
        kind: "Print",
        value: {
          kind: "Second",
          value: {
            kind: "Tuple",
            first: {
              kind: "Int",
              value: BigInt(1),
              location: { start: 14, end: 15, filename: "files/hello.rinha" },
            },
            second: {
              kind: "Int",
              value: BigInt(2),
              location: { start: 17, end: 18, filename: "files/hello.rinha" },
            },
            location: { start: 13, end: 19, filename: "files/hello.rinha" },
          },
          location: { start: 6, end: 20, filename: "files/hello.rinha" },
        },
        location: { start: 0, end: 21, filename: "files/hello.rinha" },
      },
      location: { start: 0, end: 21, filename: "files/hello.rinha" },
    };

    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["2"]]);
  });
});
