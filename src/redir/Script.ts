import PipelineBuilder from "./PipelineBuilder";
import ScriptRef from "./ScriptRef";
import Pipeline from "./Pipeline";
import { Redir, Input, Output } from "./types";

export default class Script implements Redir {
  name: string;
  prerequisites: ScriptRef[];
  scriptContent: string;

  constructor(name: string, prerequisites: ScriptRef[], scriptContent: string) {
    this.name = name;
    this.prerequisites = prerequisites;
    this.scriptContent = scriptContent;
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
