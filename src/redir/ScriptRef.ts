import * as matter from "gray-matter";
import Script from "./Script";
import ScriptResolver, { resolveAll } from "./ScriptResolver";

export default interface ScriptRef {
  name: string;

  loadScript(): Promise<Script>;
}

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
    const prereqs = await resolveAll(this.resolver, data.prerequisites);
    return new Script(this.name, prereqs, content);
  }

  loadFile(): matter.GrayMatterFile<string> {
    return matter.read(this.file, {
      delimiters: ["/* ---", "--- */"],
    });
  }
}
