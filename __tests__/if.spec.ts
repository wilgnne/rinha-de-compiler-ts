import { describe, expect, test } from "vitest";
import { type IFile } from "../src/types";
import { run } from "../src/run";
import { factoryOut } from "../src/utils";

import ifTrue from "./if_resources/if_true.json";
import ifFalse from "./if_resources/if_false.json";

describe("if spec suit", () => {
  test("if true", () => {
    const file = ifTrue as IFile;

    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["true"]]);
  });

  test("if false", () => {
    const file = ifFalse as IFile;

    const { getStdout, out } = factoryOut();
    run(file, out);
    expect(getStdout()).toStrictEqual([["false"]]);
  });
});
