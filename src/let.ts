import { runExpression } from "./run";
import {
  type Term,
  type Enviroment,
  type LetTerm,
  type Out,
  type VarTerm,
} from "./types";

export function runLet(letTerm: LetTerm, env: Enviroment, out: Out): Term {
  const value = runExpression(letTerm.value, env, out);

  env.set(letTerm.name.text, value);

  return runExpression(letTerm.next, env, out);
}

export function runVar(varTerm: VarTerm, env: Enviroment): Term {
  const term = env.get(varTerm.text);

  if (term === undefined)
    throw new Error(`Variable: ${varTerm.text} not defined`);

  return term;
}
