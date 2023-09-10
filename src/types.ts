export interface Loc {
  start: number;
  end: number;
  filename: string;
}

export interface StrTerm {
  kind: "Str";
  value: string;
  location: Loc;
}

export interface IntTerm {
  kind: "Int";
  value: number;
  location: Loc;
}

export interface BoolTerm {
  kind: "Bool";
  value: boolean;
  location: Loc;
}

export type ValuableTerm = StrTerm | IntTerm | BoolTerm;

export interface PrintTerm {
  kind: "Print";
  value: Term;
  location: Loc;
}
export type Term =
  | ValuableTerm
  | PrintTerm

export interface IFile {
  name: string;
  expression: Term;
  location: Loc;
}

export type Out = (...data: unknown[]) => void;

export type Enviroment = Map<string, Term>;