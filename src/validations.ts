import {
  type BoolTerm,
  type IntTerm,
  type Term,
  type ValuableTerm,
} from "./types";

export function validIntTerm(a: Term): IntTerm {
  if (a.kind === "Int") return a;
  throw new Error(`Invalid kind: ${a.kind}`);
}

export function validBoolTerm(a: Term): BoolTerm {
  if (a.kind === "Bool") return a;
  throw new Error(`Invalid kind: ${a.kind}`);
}

export function validValuableTerm(a: Term): ValuableTerm {
  if (a.kind === "Bool" || a.kind === "Int" || a.kind === "Str") return a;
  throw new Error(`Invalid kind: ${a.kind}`);
}

export function validIntInt(a: Term, b: Term): [IntTerm, IntTerm] {
  return [validIntTerm(a), validIntTerm(b)];
}
