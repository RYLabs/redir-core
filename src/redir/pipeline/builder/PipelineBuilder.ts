import { Pipeline } from "../Pipeline";
import { Redir } from "../../Redir";
import { Stage } from "../Stage";
import { StageBuilder } from "./StageBuilder";

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

  nextStage(): StageBuilder {
    const next = new StageBuilder(this);
    this.stage.nextStage = next;
    next.previousStage = this.stage;
    this.stage = next;
    return next;
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
