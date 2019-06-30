import { Pipeline, Stage } from "./Pipeline";
import { Script, ResultTarget } from "./Script";
import { ProcessUnit } from "./ProcessUnit";
import { Redir } from "./Redir";

class StageBuilder {
  pipeline: PipelineBuilder;
  processes: ProcessUnit[] = [];
  nextStage?: StageBuilder;
  previousStage?: StageBuilder;

  constructor(pipeline: PipelineBuilder) {
    this.pipeline = pipeline;
  }

  build(): Stage {
    return new Stage(this.processes);
  }

  addScript(script: Script, resultTarget?: ResultTarget): Promise<StageBuilder> {
    this.processes.push(new ProcessUnit(this.pipeline.redir, script, resultTarget));

    if (!script.prerequisites.length) {
      return Promise.resolve(this);
    }

    if (!this.previousStage) {
      this.previousStage = new StageBuilder(this.pipeline);
      this.previousStage.nextStage = this;
      this.pipeline.headStage = this.previousStage;
    }

    const promises = script.prerequisites.map(req =>
      req.scriptRef.loadScript().then(script => this.previousStage!.addScript(script, req.resultTarget)),
    );

    return Promise.all(promises).then(() => this);
  }
}

export class PipelineBuilder {
  redir: Redir;
  stage = new StageBuilder(this);
  headStage = this.stage;

  constructor(redir: Redir) {
    this.redir = redir;
  }

  currentStage(): StageBuilder {
    return this.stage;
  }

  build(): Pipeline {
    const stages: Stage[] = [];
    let curStage = this.headStage;
    stages.push(curStage.build());
    while (curStage.nextStage) {
      curStage = curStage.nextStage;
      stages.push(curStage.build());
    }
    const pipeline = new Pipeline(stages);
    return pipeline;
  }
}
