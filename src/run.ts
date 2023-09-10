import { runBinary } from "./binary";
import { runIf } from "./if";
import { runPrint } from "./print";
import { type Enviroment, type IFile, type Out, type Term } from "./types";

export function runExpression(
  expression: Term,
  env: Enviroment,
  out: Out,
): Term {
  switch (expression.kind) {
    case "If":
      return runIf(expression, env, out);
    case "Binary":
      return runBinary(expression, env, out);
    case "Print":
      return runPrint(expression, env, out);
    case "Bool":
    case "Int":
    case "Str":
      return expression;
    default: {
      throw new Error(`Kind: ${(expression as Term).kind} not implemented`);
    }
  }
}

export function run(program: IFile, out: Out = console.log): void {
  const env: Enviroment = new Map();

  runExpression(program.expression, env, out);
}
