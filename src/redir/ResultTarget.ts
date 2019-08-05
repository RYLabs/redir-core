import { Context, Output } from "./types";

export enum ResultTargetType {
  Context,
  Output,
}

export class ResultTarget {
  type: ResultTargetType = ResultTargetType.Output;
  name: string;

  constructor(name: string, type?: ResultTargetType) {
    this.name = name;
    this.type = type || ResultTargetType.Output;
  }

  store(result: Output, output: any, context: Context) {
    if (this.type === ResultTargetType.Context) {
      // debug(
      //   `Storing results of ${
      //     task.name
      //   } in context as ${task.resultContextName}`
      // );
      context[this.name] = result;
    } else {
      output[this.name] = result;
    }
  }
}
