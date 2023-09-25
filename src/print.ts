import { runExpression } from "./run";
import {
  type ValuableTerm,
  type Enviroment,
  type PrintTerm,
  type Term,
} from "./types";
import { type IOut } from "./utils";

export function toStr(term: Term): string {
  switch (term.kind) {
    case "Closure":
      return "<#closure>";
    case "Tuple":
      return `(${toStr(term.first)}, ${toStr(term.second)})`;
    default:
      return `${(term as ValuableTerm).value}`;
  }
}

export function runPrint(
  printTerm: PrintTerm,
  env: Enviroment,
  out: IOut,
): Term {
  const term = runExpression(printTerm.value, env, out);

  out.out(toStr(term));

  return term;
}
