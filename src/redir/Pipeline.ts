import ProcessUnit from "./ProcessUnit";
import { Redir, Output, Input } from "./types";

export class Stage implements Redir {
  processes: ProcessUnit[];

  constructor(processes: ProcessUnit[]) {
    this.processes = processes;
  }

  async run(input: Promise<Input>, context: any): Promise<Output> {
    const promises = this.processes.map(proc => proc.run(input, context));
    const results = await Promise.all(promises);

    const combinedOutput: { [key: string]: Output } = {},
      newContext: { [key: string]: any } = {};

    for (let i = 0, len = this.processes.length; i < len; i++) {
      const proc = this.processes[i];
      proc.resultTarget.store(results[i], combinedOutput, newContext);
    }

    Object.assign(context, newContext);

    const keys = Object.keys(combinedOutput);
    return keys.length === 1 ? combinedOutput[keys[0]] : combinedOutput;
  }
}

export default class Pipeline implements Redir {
  stages: Stage[];

  constructor(stages: Stage[]) {
    this.stages = stages;
  }

  async run(input: Promise<Input>, context: any): Promise<Output> {
    return await this.stages.reduce(async (val, stage) => await stage.run(val, context), input);
  }
}
