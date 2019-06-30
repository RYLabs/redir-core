import * as vm from "vm";
import Script, { ScriptOptions } from "./Script";
import { Redir, Output, Input } from "./types";
import fetchProcessor from "./result/fetch";
import ResultTarget from "./ResultTarget";

export type ContextPreprocessor = (context: any, options: ScriptOptions) => void;
export type ResultProcessor = (result: Promise<Output>, context: any, options: ScriptOptions) => void;

const contextPreprocessors: ContextPreprocessor[] = [];
const resultProcessors: ResultProcessor[] = [fetchProcessor];

export function registerContextPreprocessor(proc: ContextPreprocessor) {
  contextPreprocessors.push(proc);
}

export function registerResultProcessor(proc: ResultProcessor) {
  resultProcessors.push(proc);
}

export default class ProcessUnit implements Redir {
  vmPromise?: Promise<any>;
  scriptContent: string;
  options: ScriptOptions;
  resultTarget: ResultTarget;

  constructor(script: Script, resultTarget?: ResultTarget) {
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
    output = resultProcessors.reduce(proc => proc(context, this.options), output);
    return output;
  }

  createVM(context: any): vm.Context {
    const sandbox = { ...context };
    contextPreprocessors.forEach(proc => proc(sandbox, this.options));

    const vmContext = vm.createContext(sandbox);
    vm.runInContext(this.scriptContent, vmContext);

    // debug("sandbox keys:", Object.keys(sandbox));

    return vmContext;
  }
}
