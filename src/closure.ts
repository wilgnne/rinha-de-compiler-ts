import crypto from "crypto";
import { runExpression } from "./run";
import {
  type Enviroment,
  type FuncTerm,
  type Term,
  type ClosureTerm,
  type CallTerm,
  type Out,
} from "./types";
import { factoryOut } from "./utils";

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

export function runCall(callTerm: CallTerm, env: Enviroment, out: Out): Term {
  const callee = runExpression(callTerm.callee, env, out);

  if (callee.kind === "Closure") {
    const args = callTerm.arguments.map((argument) =>
      runExpression(argument, env, out),
    );

    if (args.length !== callee.parameters.length)
      throw new Error("Incorrect args");

    const closureEnv = new Map(callee.env);

    callee.parameters.forEach((param, index) =>
      closureEnv.set(param.text, args[index]),
    );

    const cachedClousure = callCache.get(callee.key);

    if (cachedClousure !== undefined) {
      const cachedResult = cachedClousure.get(JSON.stringify(args));
      if (cachedResult !== undefined) {
        const { outs, result } = cachedResult;
        outs.forEach((d) => {
          out(d);
        });

        return result;
      }
    } else {
      callCache.set(callee.key, new Map());
    }

    const { getStdout, out: callOut } = factoryOut();
    const resultTerm = runExpression(callee.value, closureEnv, callOut);
    const resultOut = getStdout();
    resultOut.forEach((d) => {
      out(d);
    });

    callCache
      .get(callee.key)
      ?.set(JSON.stringify(args), { result: resultTerm, outs: resultOut });

    return resultTerm;
  }

  throw new Error(`${callee.kind} is not callable`);
}
