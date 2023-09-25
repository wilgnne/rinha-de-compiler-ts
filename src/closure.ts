import crypto from "crypto";
import {
  type Enviroment,
  type FuncTerm,
  type Term,
  type ClosureTerm,
  type CallTerm,
} from "./types";
import { type IOut, factoryOut } from "./utils";
import { runExpression } from "./run";

export function runFunction(funcTerm: FuncTerm, env: Enviroment): Term {
  const closure: ClosureTerm = {
    kind: "Closure",
    key: crypto.randomUUID(),
    env,
    parameters: funcTerm.parameters,
    value: funcTerm.value,
    location: funcTerm.location,
  };

  return closure;
}

const callCache = new Map<
  string,
  Map<string, { result: Term; outs: unknown[][] }>
>();

function getCallee(
  callTerm: CallTerm,
  env: Enviroment,
  out: IOut,
  runner = runExpression,
  deep = 0,
): ClosureTerm {
  const callee = runner(callTerm.callee, env, out, deep + 1);

  if (callee.kind !== "Closure")
    throw new Error(`${callee.kind} is not callable`);

  return callee;
}

export function getArgs(
  callee: ClosureTerm,
  rawArguments: Term[],
  env: Enviroment,
  out: IOut,
  runner = runExpression,
  deep = 0,
): Term[] {
  const args = rawArguments.map((argument) =>
    runner(argument, env, out, deep + 1),
  );

  // console.log(
  //   `call ${callee.key} with ${args
  //     .map((a) => (a as ValuableTerm).value)
  //     .join(", ")}`,
  // );

  if (args.length !== callee.parameters.length)
    throw new Error("Incorrect args");

  return args;
}

export function factoryEnv(callee: ClosureTerm, args: Term[]): Enviroment {
  const closureEnv = new Map(callee.env);

  callee.parameters.forEach((param, index) =>
    closureEnv.set(param.text, args[index]),
  );

  return closureEnv;
}

export function getCachedResult(
  callee: ClosureTerm,
  args: Array<Omit<Term, "location">>,
  out: IOut,
): Term | undefined {
  const cachedClousure = callCache.get(callee.key);

  // console.log(`closure${cachedClousure === undefined ? " not" : ""} cached`);

  if (cachedClousure !== undefined) {
    const cachedResult = cachedClousure.get(
      JSON.stringify(args, (_, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );

    // console.log(
    //   `args ${JSON.stringify(args, (_, value) =>
    //     typeof value === "bigint" ? value.toString() : value,
    //   )}${cachedResult === undefined ? " not" : ""} cached`,
    // );

    if (cachedResult !== undefined) {
      const { outs, result } = cachedResult;
      outs.forEach((d) => {
        out.out(d);
      });

      return result;
    }
  } else {
    callCache.set(callee.key, new Map());
  }
}

export function setCachedResult(
  callee: ClosureTerm,
  resultTerm: Term,
  args: Array<Omit<Term, "location">>,
  resultOut: unknown[][],
): void {
  callCache.get(callee.key)?.set(
    JSON.stringify(args, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
    {
      result: resultTerm,
      outs: resultOut,
    },
  );
}

function runClosure(
  callee: ClosureTerm,
  closureEnv: Enviroment,
  args: Array<Omit<Term, "location">>,
  out: IOut,
  runner = runExpression,
  deep = 0,
): Term {
  const callOut = factoryOut();
  const resultTerm = runner(callee.value, closureEnv, callOut, deep + 1);
  const resultOut = callOut.getStdout();
  resultOut.forEach(out.out);

  setCachedResult(callee, resultTerm, args, resultOut);

  return resultTerm;
}

export function runCall(
  callTerm: CallTerm,
  env: Enviroment,
  out: IOut,
  runner = runExpression,
  deep = 0,
): Term {
  const callee = getCallee(callTerm, env, out, runner, deep);
  const args = getArgs(callee, callTerm.arguments, env, out, runner, deep);

  const argsWithoutLocation = args.map(({ location: _, ...args }) => args);
  const cachedResult = getCachedResult(callee, argsWithoutLocation, out);
  if (cachedResult !== undefined) return cachedResult;

  const closureEnv = factoryEnv(callee, args);
  return runClosure(callee, closureEnv, argsWithoutLocation, out, runner, deep);
}
