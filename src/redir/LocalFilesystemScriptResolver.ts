import { homedir } from "os";
import * as fs from "fs";
import * as path from "path";
import ScriptRef, { FileScriptRef } from "./ScriptRef";
import ScriptResolver from "./ScriptResolver";

export default class LocalFilesystemScriptResolver implements ScriptResolver {
  async resolve(name: string): Promise<ScriptRef> {
    const fn = this.getScriptFile(name);
    try {
      await this.checkScriptFile(fn);
      return new FileScriptRef(this, name, fn);
    } catch (err) {
      if (err.code === "ENOENT") {
        throw new Error(`Script \`${name}\` not found`);
      }
      throw err;
    }
  }

  checkScriptFile(fn: string) {
    return new Promise((resolve, reject) => {
      fs.access(fn, fs.constants.F_OK | fs.constants.R_OK, err => (err ? reject(err) : resolve()));
    });
  }

  localScriptsDir(): string {
    return path.join(homedir(), ".redir", "scripts", "local");
  }

  getScriptFile(name: string): string {
    return path.join(this.localScriptsDir(), `${name}.js`);
  }
}
