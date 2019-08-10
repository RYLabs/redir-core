import Logger from "nightingale-logger";
import { Context, Output } from "./types";

const logger = new Logger("redir:ResultTarget");

export enum ResultTargetType {
  Output,
  Context,
}

export class ResultTarget {
  type: ResultTargetType = ResultTargetType.Output;
  name: string;

  constructor(name: string, type?: ResultTargetType) {
    this.name = name;
    this.type = type || ResultTargetType.Context;
  }

  store(result: Output, output: any, context: Context) {
    if (this.type === ResultTargetType.Context) {
      logger.debug(`Storing results as ${this.name} in context`);
      context[this.name] = result;
    } else {
      output[this.name] = result;
    }
  }
}
