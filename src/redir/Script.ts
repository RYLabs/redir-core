import PipelineBuilder from "./PipelineBuilder";
import Pipeline from "./Pipeline";
import { Redir, Input, Output } from "./types";
import Prerequisite from "./Prerequisite";

export type ScriptOptions = { [key: string]: any };

export default class Script implements Redir {
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

  createPipeline(): Pipeline {
    const builder = new PipelineBuilder();
    builder.currentStage().addScript(this);
    return builder.build();
  }

  run(input: Promise<Input>, context: any): Promise<Output> {
    return this.createPipeline().run(input, context);
  }
}
