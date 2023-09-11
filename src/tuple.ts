import { runExpression } from "./run";
import { type Enviroment, type Out, type Term, type TupleTerm } from "./types";

export function runTuple(
  tupleTerm: TupleTerm,
  env: Enviroment,
  out: Out,
): Term {
  const first = runExpression(tupleTerm.first, env, out);
  const second = runExpression(tupleTerm.second, env, out);

  return {
    kind: "Tuple",
    first,
    second,
    location: tupleTerm.location,
  };
}
