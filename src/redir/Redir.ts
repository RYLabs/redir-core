import { ScriptOptions } from "./Script";
import { Output, Input } from "./types";
import ScriptResolver from "./ScriptResolver";
import LocalFilesystemScriptResolver from "./LocalFilesystemScriptResolver";
import { EmptyInput } from "./inputs";

export type ContextProcessor = (context: any, options: ScriptOptions) => void;
export type ResultProcessor = (result: Promise<Output>, context: any, options: ScriptOptions) => void;

export class Redir {
  contextProcessors: ContextProcessor[] = [];
  resultProcessors: ResultProcessor[] = [];
  scriptResolver: ScriptResolver = new LocalFilesystemScriptResolver();

  async runScript(name: string, input?: Promise<Input>): Promise<Output> {
    const scriptRef = await this.scriptResolver.resolve(name);
    const script = await scriptRef.loadScript();
    const context = {};
    return script.createPipeline(this).run(input || Promise.resolve(EmptyInput), context);
  }
}
