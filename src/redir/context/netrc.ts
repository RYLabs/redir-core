// /// <reference path="../../ambient.d.ts"/>

// import { ScriptOptions } from "../Script";
// import { flatten } from "lodash";
// import * as netrc from "netrc";
// import { Context } from "../types";

// export default (context: Context, options: ScriptOptions) => {
//   if ("netrc" in options) {
//     const logins = flatten([options.netrc]),
//       myNetrc = netrc();

//     context.netrc = {};
//     for (const name of logins) {
//       // debug("loading credentials for:", name);
//       context.netrc[name] = myNetrc[name];
//     }
//   }
// };
