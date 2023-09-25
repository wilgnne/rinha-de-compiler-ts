import { runExpression } from "./run";
import { type Enviroment, type Term, type TupleTerm } from "./types";
import { type IOut } from "./utils";

export function runTuple(
  tupleTerm: TupleTerm,
  env: Enviroment,
  out: IOut,
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
