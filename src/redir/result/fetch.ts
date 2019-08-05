import fetch from "../util/fetch";
import { Context, Output } from "../types";
import { ScriptOptions } from "../Script";
import { StringArrayIO, StringIO } from "../io";

export default (result: Promise<Output>, context: Context, options: ScriptOptions): Promise<Output> => {
  if (options.fetch === true) {
    // debug("running fetch on initial result:", result);
    return fetch(result).then(data => (Array.isArray(data) ? new StringArrayIO(data) : new StringIO(data)));
  }
  return result;
};
