import { ProcessUnit } from "./ProcessUnit";
import { Output, Input, Context, Runnable } from "./types";
import { ObjectOutput, StringIO } from "./io";
import { DefaultContext } from "./DefaultContext";

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

export class Pipeline implements Runnable {
  stages: Stage[];

  constructor(stages: Stage[]) {
    this.stages = stages;
  }

  toString(): string {
    return this.stages.map(stage => stage.toString()).join(" => ");
  }

  run(input: Promise<Input>, context: Context): Promise<Output> {
    const curStages = this.stages.slice();
    const stage = curStages.shift();
    if (stage) {
      return this.runStage(stage, curStages, input, context);
    } else {
      return new StringIO(input.toString()).promise();
    }
  }

  runStage(stage: Stage, remainingStages: Stage[], input: Promise<Input>, context: Context): Promise<Output> {
    return stage.run(input, context).then(output => {
      const nextStage = remainingStages.shift();
      if (nextStage) {
        return this.runStage(nextStage, remainingStages, output.toInput(), context);
      } else {
        return output;
      }
    });
  }
}
