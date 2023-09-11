import { describe, expect, test } from "vitest";
import { type IFile } from "../src/types";
import { factoryOut } from "../src/utils";
import { run } from "../src/run";

describe("let spec suit", () => {
  test("declare let", () => {
    const file: IFile = {
      name: "files/hello.rinha",
      expression: {
        kind: "Let",
        name: {
          text: "x",
          location: { start: 4, end: 5, filename: "files/hello.rinha" },
        },
        value: {
          kind: "Int",
          value: 1,
          location: { start: 8, end: 9, filename: "files/hello.rinha" },
        },
        next: {
          kind: "Print",
          value: {
            kind: "Var",
            text: "x",
            location: { start: 18, end: 19, filename: "files/hello.rinha" },
          },
          location: { start: 12, end: 20, filename: "files/hello.rinha" },
        },
        location: { start: 0, end: 20, filename: "files/hello.rinha" },
      },
      location: { start: 0, end: 20, filename: "files/hello.rinha" },
    };

    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["1"]]);
  });

  test("declare 2 let and sum", () => {
    const file: IFile = {
      name: "files/hello.rinha",
      expression: {
        kind: "Let",
        name: {
          text: "x",
          location: { start: 4, end: 5, filename: "files/hello.rinha" },
        },
        value: {
          kind: "Int",
          value: 1,
          location: { start: 8, end: 9, filename: "files/hello.rinha" },
        },
        next: {
          kind: "Let",
          name: {
            text: "y",
            location: { start: 15, end: 16, filename: "files/hello.rinha" },
          },
          value: {
            kind: "Int",
            value: 1,
            location: { start: 19, end: 20, filename: "files/hello.rinha" },
          },
          next: {
            kind: "Print",
            value: {
              kind: "Binary",
              lhs: {
                kind: "Var",
                text: "x",
                location: { start: 29, end: 30, filename: "files/hello.rinha" },
              },
              op: "Add",
              rhs: {
                kind: "Var",
                text: "y",
                location: { start: 33, end: 34, filename: "files/hello.rinha" },
              },
              location: { start: 29, end: 34, filename: "files/hello.rinha" },
            },
            location: { start: 23, end: 35, filename: "files/hello.rinha" },
          },
          location: { start: 11, end: 35, filename: "files/hello.rinha" },
        },
        location: { start: 0, end: 35, filename: "files/hello.rinha" },
      },
      location: { start: 0, end: 35, filename: "files/hello.rinha" },
    };

    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["2"]]);
  });
});
