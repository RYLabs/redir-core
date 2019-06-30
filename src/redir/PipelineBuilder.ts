import Pipeline, { Stage } from "./Pipeline";
import Script from "./Script";
import ProcessUnit from "./ProcessUnit";
import ResultTarget from "./ResultTarget";

class StageBuilder {
  pipeline: PipelineBuilder;
  processes: ProcessUnit[] = [];
  beforeStage?: StageBuilder;

  constructor(pipeline: PipelineBuilder) {
    this.pipeline = pipeline;
  }

  build(): Stage {
    return new Stage(this.processes);
  }

  async addScript(script: Script, resultTarget?: ResultTarget) {
    this.processes.push(new ProcessUnit(script, resultTarget));

    if (script.prerequisites) {
      if (!this.beforeStage) {
        this.beforeStage = new StageBuilder(this.pipeline);
      }
      const promises = script.prerequisites.map(req =>
        req.scriptRef
          .loadScript()
          .then(script => this.beforeStage && this.beforeStage.addScript(script, req.resultTarget)),
      );
      await Promise.all(promises);
    }
  }
}

export default class PipelineBuilder {
  stage = new StageBuilder(this);

  currentStage(): StageBuilder {
    return this.stage;
  }

  build(): Pipeline {
    const stages: Stage[] = [];
    let curStage = this.stage;
    stages.unshift(curStage.build());
    while (curStage.beforeStage) {
      curStage = curStage.beforeStage;
      stages.unshift(curStage.build());
    }
    return new Pipeline(stages);
  }
}