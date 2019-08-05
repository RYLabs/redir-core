import { PipelineBuilder } from './PipelineBuilder';
import { ProcessUnit } from '../../ProcessUnit';
import { ResultTarget } from '../../ResultTarget';
import { Script } from '../../Script';
import { Stage } from '../Stage';

export class StageBuilder {
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
      req.scriptRef.loadScript().then(reqScript => this.previousStage!.addScript(reqScript, req.resultTarget)),
    );

    return Promise.all(promises).then(() => this);
  }
}

