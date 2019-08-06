import { Context, Input, Output, RedirFunction } from "./types";
import { DefaultContext } from "./DefaultContext";
import { emptyInput } from "./inputs";
import { LocalFilesystemScriptResolver } from "./LocalFilesystemScriptResolver";
import { Script, ScriptOptions } from "./Script";
import { ScriptResolver } from "./ScriptResolver";

export type ContextProcessor = (context: Context, options: ScriptOptions) => void;
export type ResultProcessor = (output: Promise<Output>, context: Context, options: ScriptOptions) => Promise<Output>;

export class Redir {
  contextProcessors: ContextProcessor[] = [];
  resultProcessors: ResultProcessor[] = [];
  scriptResolver: ScriptResolver = LocalFilesystemScriptResolver.defaultResolver();

  runScript(script: Script, input?: Promise<Input>): Promise<Output> {
    const context = new DefaultContext();
    return script.createPipeline(this).then(pipeline => pipeline.run(input || emptyInput.promise(), context));
  }

  async run(scriptName: string, input?: Promise<Input>): Promise<Output> {
    const scriptRef = await this.scriptResolver.resolve(scriptName);
    const script = await scriptRef.loadScript();
    return this.runScript(script, input);
  }
}
