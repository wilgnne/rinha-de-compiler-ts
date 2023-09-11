import { runBinary } from "./binary";
import { runCall, runFunction } from "./closure";
import { runIf } from "./if";
import { runLet, runVar } from "./let";
import { runPrint } from "./print";
import { runTuple } from "./tuple";
import { type IFile, type Term, type Out, type Enviroment } from "./types";

export function runExpression(
  expression: Term,
  env: Enviroment,
  out: Out,
): Term {
  switch (expression.kind) {
    case "Call":
      return runCall(expression, env, out);
    case "If":
      return runIf(expression, env, out);
    case "Binary":
      return runBinary(expression, env, out);
    case "Print":
      return runPrint(expression, env, out);
    case "Let":
      return runLet(expression, env, out);
    case "Tuple":
      return runTuple(expression, env, out);
    case "Function":
      return runFunction(expression, env);
    case "Var":
      return runVar(expression, env);
    case "Bool":
    case "Int":
    case "Str":
    case "Closure":
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
