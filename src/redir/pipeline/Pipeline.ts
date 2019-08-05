import { Context, Input, Output, Runnable } from "../types";
import { Stage } from "./Stage";
import { StringIO } from "../io";

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
