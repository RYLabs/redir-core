import * as vm from "vm";
import { Context, Input, Output, RedirFunction, Runnable } from "./types";
import { ObjectOutput, StringIO } from "./io";
import { Redir, ResultProcessor } from "./Redir";
import { ResultTarget } from "./ResultTarget";
import { Script, ScriptOptions } from "./Script";
import Logger from "nightingale-logger";

const logger = new Logger("redir:ProcessUnit");

export class ProcessUnit implements Runnable {
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
    const initialOut = this.runScriptInVM(input, context);
    return this.redir.resultProcessors.reduce((out, proc) => proc(out, context, this.options), initialOut);
  }

  async runScriptInVM(input: Promise<Input>, context: Context): Promise<Output> {
    logger.debug("creating vm...");
    const [vmInstance, inputVal] = await Promise.all([this.createVM(context), input]);

    if (!("handle" in vmInstance)) {
      logger.debug("missing handle method!");
      throw new Error("Expecting handle(input) method in script");
    }

    logger.debug("handling input:", inputVal);
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

    logger.debug("sandbox keys:", Object.keys(sandbox));

    return vmContext;
  }
}
