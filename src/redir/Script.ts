import PipelineBuilder from "./PipelineBuilder";
import Pipeline from "./Pipeline";
import { Input, Output } from "./types";
import Prerequisite from "./Prerequisite";
import { Redir } from "./Redir";

export type ScriptOptions = { [key: string]: any };

export default class Script {
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

  createPipeline(redir: Redir): Pipeline {
    const builder = new PipelineBuilder(redir);
    builder.currentStage().addScript(this);
    return builder.build();
  }
}
