import fetch from "../util/fetch";
import { ScriptOptions } from "../Script";
import { Output } from "../types";
import { StringOutput, StringArrayOutput } from "../outputs";

export default (result: Promise<Output>, context: any, options: ScriptOptions): Promise<Output> => {
  if (options.fetch === true) {
    // debug("running fetch on initial result:", result);
    return fetch(result).then(data => (Array.isArray(data) ? new StringArrayOutput(data) : new StringOutput(data)));
  }
  return result;
};
