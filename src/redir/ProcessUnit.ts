import * as vm from "vm";
import { Script, ScriptOptions, ResultTarget } from "./Script";
import { RedirFunction, Output, Input, Context } from "./types";
import { Redir, ResultProcessor } from "./Redir";
import { StringIO, ObjectOutput } from "./io";

export class ProcessUnit implements RedirFunction {
  name: string;
  scriptContent: string;
  options: ScriptOptions;
  resultTarget: ResultTarget;
  redir: Redir;

  constructor(redir: Redir, script: Script, resultTarget?: ResultTarget) {
    this.redir = redir;
    this.name = script.name;
    this.scriptContent = script.scriptContent;
    this.options = script.options;
    this.resultTarget = resultTarget || new ResultTarget(script.name);
  }

  run(input: Promise<Input>, context: Context): Promise<Output> {
    let promise = this.runScriptInVM(input, context);
    return this.redir.resultProcessors.reduce((val, proc) => proc(val, context, this.options), promise);
  }

  async runScriptInVM(input: Promise<Input>, context: Context): Promise<Output> {
    // debug("creating vm...");
    const [vm, inputVal] = await Promise.all([this.createVM(context), input]);

    if (!("handle" in vm)) {
      //debug("missing handle method!");
      throw new Error("Expecting handle(input) method in script");
    }

    // debug("handling input:", inputVal);
    const result = vm.handle(inputVal.toString());
    if (typeof result === "string") {
      return new StringIO(result).promise();
    } else {
      return new ObjectOutput(result).promise();
    }
  }

  createVM(context: Context): vm.Context {
    const sandbox = { ...context };
    this.redir.contextProcessors.forEach(proc => proc(sandbox, this.options));

    const vmContext = vm.createContext(sandbox);
    vm.runInContext(this.scriptContent, vmContext);

    // debug("sandbox keys:", Object.keys(sandbox));

    return vmContext;
  }
}
