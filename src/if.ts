import { runExpression } from "./run";
import { type Enviroment, type Out, type IfTerm, type Term } from "./types";
import { validBoolTerm } from "./validations";

export function runIf(ifTerm: IfTerm, env: Enviroment, out: Out): Term {
  const condition = validBoolTerm(runExpression(ifTerm.condition, env, out));

  if (condition.value) return runExpression(ifTerm.then, env, out);
  else return runExpression(ifTerm.otherwise, env, out);
}
