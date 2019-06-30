import { PipelineBuilder } from "./PipelineBuilder";
import { Pipeline } from "./Pipeline";
import { Input, Output } from "./types";
import { Redir } from "./Redir";
import { ScriptRef } from "./ScriptRef";

export type ScriptOptions = { [key: string]: any };

export class Prerequisite {
  scriptRef: ScriptRef;
  resultTarget?: ResultTarget;

  constructor(ref: ScriptRef, resultTarget?: ResultTarget) {
    this.scriptRef = ref;
    this.resultTarget = resultTarget;
  }
}

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

  store(result: Output, output: any, context: any) {
    if (this.type == ResultTargetType.Context) {
      //debug(
      //  `Storing results of ${
      //    task.name
      //  } in context as ${task.resultContextName}`
      //);
      context[this.name] = result;
    } else {
      output[this.name] = result;
    }
  }
}

export class Script implements ScriptRef {
  name: string;
  prerequisites: Prerequisite[];
  scriptContent: string;
  options: ScriptOptions;

  constructor(name: string, prerequisites: Prerequisite[], scriptContent: string, options: ScriptOptions) {
    this.name = name;
    this.prerequisites = prerequisites;
    this.scriptContent = scriptContent;
    this.options = options;
  }

  createPipeline(redir: Redir): Promise<Pipeline> {
    const builder = new PipelineBuilder(redir);
    return builder
      .currentStage()
      .addScript(this)
      .then(() => builder.build());
  }

  loadScript(): Promise<Script> {
    return Promise.resolve(this);
  }
}
