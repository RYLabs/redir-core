import * as vm from "vm";
import { Context, Input, Output, RedirFunction, Runnable } from "./types";
import { ObjectOutput, StringIO } from "./io";
import { Redir } from "./Redir";
import { ResultTarget } from "./ResultTarget";
import { Script, ScriptOptions } from "./Script";

export class ProcessUnit implements Runnable {
  name: string;
  scriptContent: string;
  options: ScriptOptions;
  resultProcessor?: RedirFunction;
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
    const promise = this.runScriptInVM(input, context),
      proc = this.resultProcessor;
    if (proc) {
      return promise.then(output => proc!(output.toInput(), context));
    } else {
      return promise;
    }
  }

  async runScriptInVM(input: Promise<Input>, context: Context): Promise<Output> {
    // debug("creating vm...");
    const [vmInstance, inputVal] = await Promise.all([this.createVM(context), input]);

    if (!("handle" in vmInstance)) {
      // debug("missing handle method!");
      throw new Error("Expecting handle(input) method in script");
    }

    // debug("handling input:", inputVal);
    const result = vmInstance.handle(inputVal.toString());
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
