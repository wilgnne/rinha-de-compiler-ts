export interface Loc {
  start: number;
  end: number;
  filename: string;
}

export interface NullTerm {
  kind: "Null";
  value: null;
  location: Loc;
}

export interface StrTerm {
  kind: "Str";
  value: string;
  location: Loc;
}

export interface IntTerm {
  kind: "Int";
  value: bigint;
  location: Loc;
}

export interface BoolTerm {
  kind: "Bool";
  value: boolean;
  location: Loc;
}

export interface TupleTerm {
  kind: "Tuple";
  first: Term;
  second: Term;
  location: Loc;
}

export interface FirstTerm {
  kind: "First";
  value: Term;
  location: Loc;
}

export interface SecondTerm {
  kind: "Second";
  value: Term;
  location: Loc;
}

export type ValuableTerm = StrTerm | IntTerm | BoolTerm | NullTerm;

export type BinaryOp =
  | "Add"
  | "Sub"
  | "Mul"
  | "Div"
  | "Rem"
  | "Eq"
  | "Neq"
  | "Lt"
  | "Gt"
  | "Lte"
  | "Gte"
  | "And"
  | "Or";

export interface BinaryTerm {
  kind: "Binary";
  lhs: Term;
  op: BinaryOp;
  rhs: Term;
  location: Loc;
}

export interface PrintTerm {
  kind: "Print";
  value: Term;
  location: Loc;
}

export interface ParamTerm {
  text: string;
  location: Loc;
}

export interface FuncTerm {
  kind: "Function";
  parameters: ParamTerm[];
  value: Term;
  location: Loc;
}

export interface ClosureTerm {
  kind: "Closure";
  key: string;
  env: Enviroment;
  parameters: ParamTerm[];
  value: Term;
  location: Loc;
}

export interface ClosureReturn {
  kind: "ClosureReturn";
  callee: ClosureTerm;
  args: Array<Omit<Term, "location">>;
  location: Loc;
}

export interface CallTerm {
  kind: "Call";
  callee: Term;
  arguments: Term[];
  location: Loc;
}

export interface LetTerm {
  kind: "Let";
  name: ParamTerm;
  value: Term;
  next: Term;
  location: Loc;
}

export interface VarTerm {
  kind: "Var";
  text: string;
  location: Loc;
}

export interface IfTerm {
  kind: "If";
  condition: Term;
  then: Term;
  otherwise: Term;
  location: Loc;
}

export interface ResolverFirstTerm {
  kind: "ResolverFirst";
  value: Term;
  location: Loc;
}

export interface ResolverSecondTerm {
  kind: "ResolverSecond";
  first: Term;
  value: Term;
  location: Loc;
}

export type CompilerTerm =
  | CallTerm
  | FuncTerm
  | ValuableTerm
  | TupleTerm
  | FirstTerm
  | SecondTerm
  | LetTerm
  | VarTerm
  | IfTerm
  | PrintTerm
  | BinaryTerm;

export type ExecutionTerm =
  | ClosureTerm
  | ClosureReturn
  | ResolverFirstTerm
  | ResolverSecondTerm;

export type Term = CompilerTerm | ExecutionTerm;

export interface IFile {
  name: string;
  expression: CompilerTerm;
  location: Loc;
}

export type Out = (...data: unknown[]) => void;

export type Enviroment = Map<string, Term>;
