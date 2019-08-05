import { Context, Input, Output, Runnable } from "../types";
import { DefaultContext } from "../DefaultContext";
import { ObjectOutput } from "../io";
import { ProcessUnit } from "../ProcessUnit";

export class Stage implements Runnable {
  processes: ProcessUnit[];

  constructor(processes: ProcessUnit[]) {
    this.processes = processes;
  }

  toString(): string {
    if (this.processes.length) {
      return this.processes.map(proc => proc.name).join(",");
    } else {
      return "<empty>";
    }
  }

  async run(input: Promise<Input>, context: Context): Promise<Output> {
    const promises = this.processes.map(proc => proc.run(input, context));
    const results = await Promise.all(promises);

    const combinedOutput: { [key: string]: Output } = {},
      newContext: Context = new DefaultContext(context.userAgent);

    for (let i = 0, len = this.processes.length; i < len; i++) {
      const proc = this.processes[i];
      proc.resultTarget.store(results[i], combinedOutput, newContext);
    }

    if (Object.keys(newContext).length) {
      Object.assign(context, newContext);
    }

    const keys = Object.keys(combinedOutput);
    return keys.length === 1 ? Promise.resolve(combinedOutput[keys[0]]) : new ObjectOutput(combinedOutput);
  }
}
