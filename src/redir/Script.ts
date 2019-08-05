import { Pipeline } from "./pipeline/Pipeline";
import { PipelineBuilder } from "./pipeline/builder/PipelineBuilder";
import { Prerequisite } from "./Prerequisite";
import { Redir } from "./Redir";
import { ScriptRef } from "./types";

export interface ScriptOptions {
  [key: string]: any;
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
