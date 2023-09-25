import { getBinaryFunction, runBinary } from "./binary";
import {
  factoryEnv,
  getArgs,
  getCachedResult,
  runCall,
  runFunction,
  setCachedResult,
} from "./closure";
import { runIf } from "./if";
import { runLet, runVar } from "./let";
import { runPrint, toStr } from "./print";
import { runTuple } from "./tuple";
import {
  type IFile,
  type Term,
  type Out,
  type Enviroment,
  type ResolverSecondTerm,
} from "./types";
import { type IOut, factoryOut } from "./utils";
import { validBoolTerm } from "./validations";

export function runExpression(
  expression: Term,
  env: Enviroment,
  out: IOut,
  deep = 0,
): Term {
  switch (expression.kind) {
    case "Call":
      return runCall(expression, env, out);
    case "If":
      return runIf(expression, env, out);
    case "Binary":
      return runBinary(expression, env, out);
    case "Print":
      return runPrint(expression, env, out);
    case "Let":
      return runLet(expression, env, out);
    case "Tuple":
      return runTuple(expression, env, out);
    case "Function":
      return runFunction(expression, env);
    case "Var":
      return runVar(expression, env);
    case "Bool":
    case "Int":
    case "Str":
    case "Closure":
      return expression;
    default: {
      throw new Error(`Kind: ${(expression as Term).kind} not implemented`);
    }
  }
}

function interactiveResolve2Sides<Node extends Term>(
  returned: Term | null,
  stack: Term[],
  node: Node,
  getFirst: (node: Node) => Term,
  getSecond: (node: Node) => Term,
  onSecond: (node: ResolverSecondTerm) => Term | null,
): Term | null {
  if (returned === null) {
    stack.push(node);
    stack.push({
      kind: "ResolverFirst",
      value: getFirst(node),
      location: node.location,
    });
    return returned;
  }

  if (returned.kind === "ResolverFirst") {
    stack.push(node);
    stack.push({
      kind: "ResolverSecond",
      first: returned.value,
      value: getSecond(node),
      location: node.location,
    });
    return null;
  }
  if (returned.kind === "ResolverSecond") {
    return onSecond(returned);
  }
  throw new Error(`Kind: ${returned.kind} not implemented in tuple`);
}

export function runIterativeExpression(
  expression: Term,
  initialEnv: Enviroment,
  initialOut: IOut,
  deep = 0,
): Term {
  // console.log(deep, `----- new env -----`);

  const stack: Term[] = [expression];
  const envs: Enviroment[] = [initialEnv];
  const outs: IOut[] = [initialOut];

  let returned: Term | null = null;

  while (stack.length > 0) {
    // console.log(
    //   deep,
    //   "Stack:",
    //   stack.map((s) => s.kind),
    // );
    // console.log("Return:", returned);
    const node = stack.pop();
    const env = envs[envs.length - 1];
    const out = outs[outs.length - 1];
    // console.log("In:", node);
    // console.log();

    if (node === undefined) break;

    switch (node.kind) {
      case "Print": {
        if (returned === null) {
          stack.push(node);
          stack.push(node.value);
          break;
        }
        out.out(toStr(returned));
        break;
      }
      case "Function": {
        returned = runFunction(node, env);
        break;
      }
      case "Call": {
        if (returned === null) {
          stack.push(node);
          stack.push(node.callee);
          break;
        }
        if (returned.kind !== "Closure")
          throw new Error(`${returned.kind} is not callable`);

        const args = getArgs(
          returned,
          node.arguments,
          env,
          out,
          runIterativeExpression,
          deep,
        );

        const argsWithoutLocation = args.map(
          ({ location: _, ...args }) => args,
        );
        const cachedResult = getCachedResult(
          returned,
          argsWithoutLocation,
          out,
        );
        if (cachedResult !== undefined) {
          returned = cachedResult;
          break;
        }

        envs.push(factoryEnv(returned, args));
        const callOut = factoryOut();
        outs.push(callOut);

        stack.push({
          kind: "ClosureReturn",
          callee: returned,
          args: argsWithoutLocation,
          location: returned.value.location,
        });
        stack.push(returned.value);
        returned = null;
        break;
      }
      case "ClosureReturn": {
        if (returned === null) throw new Error(`Error: Closure returns null`);

        const resultOut = out.getStdout();
        outs.pop();
        envs.pop();
        resultOut.forEach((o) => {
          outs[outs.length - 1].out(...o);
        });
        setCachedResult(node.callee, returned, node.args, resultOut);
        break;
      }
      case "Let": {
        if (returned === null) {
          stack.push(node);
          stack.push(node.value);
          break;
        }

        env.set(node.name.text, returned);

        stack.push(node.next);
        returned = null;
        break;
      }
      case "Var": {
        const term = env.get(node.text);

        if (term === undefined)
          throw new Error(`Variable: ${node.text} not defined`);

        returned = term;
        break;
      }
      case "If": {
        if (returned === null) {
          stack.push(node);
          stack.push(node.condition);
          break;
        }

        if (validBoolTerm(returned).value) stack.push(node.then);
        else stack.push(node.otherwise);
        returned = null;
        break;
      }
      case "Binary": {
        returned = interactiveResolve2Sides(
          returned,
          stack,
          node,
          (node) => node.lhs,
          (node) => node.rhs,
          (second) => getBinaryFunction(node)(second.first, second.value),
        );
        break;
      }
      case "First": {
        if (returned === null) {
          stack.push(node);
          stack.push(node.value);
          break;
        }

        if (returned.kind !== "Tuple")
          throw new Error(`First argument not is tuple, is ${returned.kind}`);

        returned = returned.first;
        break;
      }
      case "Second": {
        if (returned === null) {
          stack.push(node);
          stack.push(node.value);
          break;
        }

        if (returned.kind !== "Tuple")
          throw new Error(`Second argument not is tuple, is ${returned.kind}`);

        returned = returned.second;
        break;
      }
      case "Tuple": {
        returned = interactiveResolve2Sides(
          returned,
          stack,
          node,
          (node) => node.first,
          (node) => node.second,
          (second) => ({
            kind: "Tuple",
            first: second.first,
            second: second.value,
            location: node.location,
          }),
        );
        break;
      }
      case "ResolverFirst": {
        if (returned === null) {
          stack.push(node);
          stack.push(node.value);
          break;
        }
        returned = {
          kind: "ResolverFirst",
          value: returned,
          location: node.location,
        };
        break;
      }
      case "ResolverSecond": {
        if (returned === null) {
          stack.push(node);
          stack.push(node.value);
          break;
        }
        returned = {
          kind: "ResolverSecond",
          first: node.first,
          value: returned,
          location: node.location,
        };
        break;
      }
      case "Int": {
        returned = { ...node, value: BigInt(node.value) };
        break;
      }
      case "Bool":
      case "Str":
      case "Closure": {
        returned = node;
        break;
      }
      default:
        throw new Error(`Kind: ${(node as Term).kind} not implemented`);
    }
  }

  if (returned === null) throw new Error(`Execution end with null `);

  // console.log(deep, "----- end env -----");
  return returned;
}

export function run(program: IFile, out: Out = console.log): void {
  const env: Enviroment = new Map();
  const o = factoryOut();

  env.set("null", {
    kind: "Null",
    value: null,
    location: { start: 0, end: 0, filename: program.location.filename },
  });

  runIterativeExpression(program.expression, env, o);

  o.getStdout().forEach((o) => {
    out(...o);
  });
}
