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

    const newInput = {},
      newContext = {};

    for (let i = 0, len = this.processes.length; i < len; i++) {
      const proc = this.processes[i];

      if (proc.shouldStoreInContext) {
        //debug(
        //  `Storing results of ${
        //    task.name
        //  } in context as ${task.resultContextName}`
        //);
        proc.storeInContext(results[i], newContext);
      } else {
        proc.storeInContext(results[i], newInput);
      }
    }

    Object.assign(context, newContext);

    const inputKeys = Object.keys(newInput);
    return inputKeys.length === 1 ? newInput[inputKeys[0]] : newInput;
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
