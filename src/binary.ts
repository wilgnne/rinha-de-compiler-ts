import { runExpression } from "./run";
import {
  type Term,
  type BinaryTerm,
  type ValuableTerm,
  type Loc,
  type Out,
  type Enviroment,
} from "./types";
import { validBoolTerm, validIntInt, validValuableTerm } from "./validations";

function factoryLocation(a: Term, b: Term): Loc {
  return {
    start: a.location.start,
    end: b.location.end,
    filename: a.location.filename,
  };
}

function Add(a: Term, b: Term): ValuableTerm {
  const location = factoryLocation(a, b);

  if (a.kind === "Int") {
    if (b.kind === "Int") {
      return { kind: "Int", value: a.value + b.value, location };
    } else if (b.kind === "Str") {
      return { kind: "Str", value: a.value + b.value, location };
    }
    throw new Error(`Invalid kind: ${b.kind}`);
  } else if (a.kind === "Str") {
    if (b.kind === "Int") {
      return { kind: "Str", value: a.value + b.value, location };
    } else if (b.kind === "Str") {
      return { kind: "Str", value: a.value + b.value, location };
    }
    throw new Error(`Invalid kind: ${b.kind}`);
  }

  throw new Error(`Invalid kind: ${a.kind}`);
}

function Sub(termA: Term, termB: Term): ValuableTerm {
  const [a, b] = validIntInt(termA, termB);
  const location = factoryLocation(a, b);

  return { kind: "Int", value: a.value - b.value, location };
}

function Mul(termA: Term, termB: Term): ValuableTerm {
  const [a, b] = validIntInt(termA, termB);
  const location = factoryLocation(a, b);

  return { kind: "Int", value: a.value * b.value, location };
}

function Div(termA: Term, termB: Term): ValuableTerm {
  const [a, b] = validIntInt(termA, termB);
  const location = factoryLocation(a, b);

  return { kind: "Int", value: a.value / b.value, location };
}

function Rem(termA: Term, termB: Term): ValuableTerm {
  const [a, b] = validIntInt(termA, termB);
  const location = factoryLocation(a, b);

  return { kind: "Int", value: a.value % b.value, location };
}

function Eq(termA: Term, termB: Term): ValuableTerm {
  const a = validValuableTerm(termA);
  const b = validValuableTerm(termB);
  const location = factoryLocation(a, b);

  return { kind: "Bool", value: a.value === b.value, location };
}

function Neq(termA: Term, termB: Term): ValuableTerm {
  const a = validValuableTerm(termA);
  const b = validValuableTerm(termB);
  const location = factoryLocation(a, b);

  return { kind: "Bool", value: a.value !== b.value, location };
}

function Lt(termA: Term, termB: Term): ValuableTerm {
  const [a, b] = validIntInt(termA, termB);
  const location = factoryLocation(a, b);

  return { kind: "Bool", value: a.value < b.value, location };
}

function Gt(termA: Term, termB: Term): ValuableTerm {
  const [a, b] = validIntInt(termA, termB);
  const location = factoryLocation(a, b);

  return { kind: "Bool", value: a.value > b.value, location };
}

function Lte(termA: Term, termB: Term): ValuableTerm {
  const [a, b] = validIntInt(termA, termB);
  const location = factoryLocation(a, b);

  return { kind: "Bool", value: a.value >= b.value, location };
}

function Gte(termA: Term, termB: Term): ValuableTerm {
  const [a, b] = validIntInt(termA, termB);
  const location = factoryLocation(a, b);

  return { kind: "Bool", value: a.value <= b.value, location };
}

function And(termA: Term, termB: Term): ValuableTerm {
  const a = validBoolTerm(termA);
  const b = validBoolTerm(termB);
  const location = factoryLocation(a, b);

  return { kind: "Bool", value: a.value && b.value, location };
}

function Or(termA: Term, termB: Term): ValuableTerm {
  const a = validBoolTerm(termA);
  const b = validBoolTerm(termB);
  const location = factoryLocation(a, b);

  return { kind: "Bool", value: a.value || b.value, location };
}

export function runBinary(
  expression: BinaryTerm,
  env: Enviroment,
  out: Out,
): ValuableTerm {
  const mapper: Record<BinaryTerm["op"], (a: Term, b: Term) => ValuableTerm> = {
    Add,
    Sub,
    Mul,
    Div,
    Rem,
    Eq,
    Neq,
    Lt,
    Gt,
    Lte,
    Gte,
    And,
    Or,
  };

  const func = mapper[expression.op];

  if (func === undefined)
    throw new Error(`Invalid operation: ${expression.op}`);

  const lhs = runExpression(expression.lhs, env, out);
  const rhs = runExpression(expression.rhs, env, out);

  return func(lhs, rhs);
}
