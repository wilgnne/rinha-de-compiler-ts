import { describe, expect, test } from "vitest";

import { type IFile } from "../src/types";
import { run } from "../src/run";
import { factoryOut } from "../src/utils";

import tuple from "./print_resources/tuple.json";
import bool from "./print_resources/bool.json";

describe("Print test suit", () => {
  test("print int", () => {
    const file: IFile = {
      name: "files/hello.rinha",
      expression: {
        kind: "Print",
        value: {
          kind: "Int",
          value: 1,
          location: { start: 6, end: 7, filename: "files/hello.rinha" },
        },
        location: { start: 0, end: 8, filename: "files/hello.rinha" },
      },
      location: { start: 0, end: 8, filename: "files/hello.rinha" },
    };

    const { getStdout, out } = factoryOut();

    run(file, out);

    expect(getStdout()).toStrictEqual([["1"]]);
  });

  test("print string", () => {
    const file: IFile = {
      name: "files/hello.rinha",
      expression: {
        kind: "Print",
        value: {
          kind: "Str",
          value: "Hello",
          location: { start: 6, end: 7, filename: "files/hello.rinha" },
        },
        location: { start: 0, end: 8, filename: "files/hello.rinha" },
      },
      location: { start: 0, end: 8, filename: "files/hello.rinha" },
    };

    const { getStdout, out } = factoryOut();

    run(file, out);

    expect(getStdout()).toStrictEqual([["Hello"]]);
  });

  test("print bool", () => {
    const file = bool as IFile;

    const { getStdout, out } = factoryOut();

    run(file, out);

    expect(getStdout()).toStrictEqual([["false"]]);
  });

  test("print tuple", () => {
    const file: IFile = tuple as IFile;

    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["(1, 2)"]]);
  });
});
