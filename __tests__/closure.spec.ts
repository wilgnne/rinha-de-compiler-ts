import { describe, expect, test } from "vitest";
import { type IFile } from "../src/types";
import { run } from "../src/run";
import { factoryOut } from "../src/utils";

import declare from "./closure_resources/declare.json";
import declareIdentity from "./closure_resources/declare_identity.json";
import runIdentity from "./closure_resources/run_identity.json";
import fib from "./closure_resources/fib.json";

describe("closure spec suit", () => {
  test("declare closure", () => {
    const file: IFile = declare as IFile;

    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["<#closure>"]]);
  });

  test("declare identity closure", () => {
    const file: IFile = declareIdentity as IFile;

    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["<#closure>"]]);
  });

  test("run identity closure", () => {
    const file: IFile = runIdentity as IFile;

    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["1"]]);
  });

  test("run fib", () => {
    const file: IFile = fib as IFile;

    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["55"]]);
  });
});
