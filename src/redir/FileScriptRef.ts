import * as matter from "gray-matter";
import { Prerequisite } from "./Prerequisite";
import { ResultTarget, ResultTargetType } from "./ResultTarget";
import { Script } from "./Script";
import { ScriptRef } from "./types";
import { ScriptResolver } from "./ScriptResolver";

export class FileScriptRef implements ScriptRef {
  name: string;
  file: string;
  resolver: ScriptResolver;
  constructor(resolver: ScriptResolver, name: string, file: string) {
    this.resolver = resolver;
    this.name = name;
    this.file = file;
  }
  async loadScript(): Promise<Script> {
    const { data, content } = this.loadFile();
    const prereqs = await this.loadPrerequisites(data.prerequisites);
    delete data.prerequisites;
    return new Script(this.name, prereqs, content, data);
  }
  loadFile(): matter.GrayMatterFile<string> {
    return matter.read(this.file, {
      delimiters: ["/* ---", "--- */"],
    });
  }
  loadPrerequisites(prereqs: string[]): Promise<Prerequisite[]> {
    const promises = prereqs.map(req => this.loadPrerequisite(req));
    return Promise.all(promises);
  }
  async loadPrerequisite(spec: string): Promise<Prerequisite> {
    const [scriptName, contextName] = spec.split("@");
    const scriptRef = await this.resolver.resolve(scriptName);
    const resultTarget = new ResultTarget(
      contextName || scriptName,
      contextName ? ResultTargetType.Context : ResultTargetType.Output,
    );
    return new Prerequisite(scriptRef, resultTarget);
  }
}
