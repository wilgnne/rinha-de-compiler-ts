import { describe, test, expect } from "vitest";
import { type IFile } from "../src/types";
import { run } from "../src/run";
import { factoryOut } from "../src/utils";

import sum from "./binary_resources/sum.json";
import sub from "./binary_resources/sub.json";
import mul from "./binary_resources/mul.json";
import div from "./binary_resources/div.json";
import rem from "./binary_resources/rem.json";
import eq from "./binary_resources/eq.json";
import neq from "./binary_resources/neq.json";
import lt from "./binary_resources/lt.json";
import gt from "./binary_resources/gt.json";
import lte from "./binary_resources/lte.json";
import gte from "./binary_resources/gte.json";
import and from "./binary_resources/and.json";
import or from "./binary_resources/or.json";

describe("binary operations spec suit", () => {
  test("sum", () => {
    const file = sum as IFile;
    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["2"]]);
  });

  test("sub", () => {
    const file = sub as IFile;
    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["0"]]);
  });

  test("mul", () => {
    const file = mul as IFile;
    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["2"]]);
  });

  test("div", () => {
    const file = div as IFile;
    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["1"]]);
  });

  test("rem", () => {
    const file = rem as IFile;
    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["0"]]);
  });

  test("eq", () => {
    const file = eq as IFile;
    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["true"]]);
  });

  test("neq", () => {
    const file = neq as IFile;
    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["false"]]);
  });

  test("lt", () => {
    const file = lt as IFile;
    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["false"]]);
  });

  test("gt", () => {
    const file = gt as IFile;
    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["false"]]);
  });

  test("lte", () => {
    const file = lte as IFile;
    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["true"]]);
  });

  test("gte", () => {
    const file = gte as IFile;
    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["true"]]);
  });

  test("and", () => {
    const file = and as IFile;
    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["false"]]);
  });

  test("or", () => {
    const file = or as IFile;
    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["true"]]);
  });
});
