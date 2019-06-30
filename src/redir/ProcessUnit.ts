import * as vm from "vm";
import Script, { ScriptOptions } from "./Script";
import { RedirFunction, Output, Input } from "./types";
import ResultTarget from "./ResultTarget";
import { Redir } from "./Redir";

export default class ProcessUnit implements RedirFunction {
  vmPromise?: Promise<any>;
  scriptContent: string;
  options: ScriptOptions;
  resultTarget: ResultTarget;
  redir: Redir;

  constructor(redir: Redir, script: Script, resultTarget?: ResultTarget) {
    this.redir = redir;
    this.scriptContent = script.scriptContent;
    this.options = script.options;
    this.resultTarget = resultTarget || new ResultTarget(script.name);
  }

  async run(input: Promise<Input>, context: any): Promise<Output> {
    // debug("creating vm...");
    const [vm, inputString] = await Promise.all([this.createVM(context), input]);

    if (!("handle" in vm)) {
      //debug("missing handle method!");
      throw new Error("Expecting handle(input) method in script");
    }

    // debug("handling input:", inputString);
    let output = vm.handle(input);
    output = this.redir.resultProcessors.reduce(proc => proc(context, this.options), output);
    return output;
  }

  createVM(context: any): vm.Context {
    const sandbox = { ...context };
    this.redir.contextProcessors.forEach(proc => proc(sandbox, this.options));

    const vmContext = vm.createContext(sandbox);
    vm.runInContext(this.scriptContent, vmContext);

    // debug("sandbox keys:", Object.keys(sandbox));

    return vmContext;
  }
}
