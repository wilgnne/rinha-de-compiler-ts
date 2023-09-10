import { runExpression } from "./run";
import {
  type ValuableTerm,
  type Enviroment,
  type Out,
  type PrintTerm,
  type Term,
} from "./types";

function toStr(term: Term): string {
  switch (term.kind) {
    default:
      return `${(term as ValuableTerm).value}`;
  }
}

export function runPrint(
  printTerm: PrintTerm,
  env: Enviroment,
  out: Out,
): Term {
  const term = runExpression(printTerm.value, env, out);

  out(toStr(term));

  return term;
}
