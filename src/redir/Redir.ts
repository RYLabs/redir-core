import { Script, ScriptOptions } from "./Script";
import { Output, Input, Context, RedirFunction } from "./types";
import { ScriptResolver } from "./ScriptResolver";
import { LocalFilesystemScriptResolver } from "./LocalFilesystemScriptResolver";
import { emptyInput } from "./inputs";
import { DefaultContext } from "./DefaultContext";

export type ContextProcessor = (context: Context, options: ScriptOptions) => void;

export class Redir {
  contextProcessors: ContextProcessor[] = [];
  resultProcessor?: RedirFunction;
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
