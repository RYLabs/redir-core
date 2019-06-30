import { Script, ScriptOptions } from "./Script";
import { Output, Input } from "./types";
import { ScriptResolver } from "./ScriptResolver";
import { LocalFilesystemScriptResolver } from "./LocalFilesystemScriptResolver";
import { emptyInput } from "./inputs";

export type ContextProcessor = (context: any, options: ScriptOptions) => void;
export type ResultProcessor = (result: Promise<Output>, context: any, options: ScriptOptions) => Promise<Output>;

export class Redir {
  contextProcessors: ContextProcessor[] = [];
  resultProcessors: ResultProcessor[] = [];
  scriptResolver: ScriptResolver = LocalFilesystemScriptResolver.defaultResolver();

  runScript(script: Script, input?: Promise<Input>): Promise<Output> {
    const context = {};
    return script.createPipeline(this).then(pipeline => pipeline.run(input || emptyInput.promise(), context));
  }

  async run(scriptName: string, input?: Promise<Input>): Promise<Output> {
    const scriptRef = await this.scriptResolver.resolve(scriptName);
    const script = await scriptRef.loadScript();
    return this.runScript(script, input);
  }
}
