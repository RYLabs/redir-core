/// <reference path="../../ambient.d.ts"/>

import { ScriptOptions } from "../Script";
import { flatten } from "lodash";
import * as netrc from "netrc";

export default (context: any, options: ScriptOptions) => {
  if ("netrc" in options) {
    const logins = flatten([options.netrc]),
      myNetrc = netrc();

    context.netrc = {};
    for (let name of logins) {
      // debug("loading credentials for:", name);
      context.netrc[name] = myNetrc[name];
    }
  }
};
