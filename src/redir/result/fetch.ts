import fetch from "../util/fetch";
import { ScriptOptions } from "../Script";
import { Output, Context } from "../types";
import { StringIO, StringArrayIO } from "../io";

export default (result: Promise<Output>, context: Context, options: ScriptOptions): Promise<Output> => {
  if (options.fetch === true) {
    // debug("running fetch on initial result:", result);
    return fetch(result).then(data => (Array.isArray(data) ? new StringArrayIO(data) : new StringIO(data)));
  }
  return result;
};
