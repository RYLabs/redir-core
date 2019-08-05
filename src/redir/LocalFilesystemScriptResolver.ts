import * as fs from "fs";
import * as path from "path";
import { FileScriptRef } from "./FileScriptRef";
import { homedir } from "os";
import { ScriptRef } from "./types";
import { ScriptResolver } from "./ScriptResolver";

export class LocalFilesystemScriptResolver implements ScriptResolver {
  static defaultResolver(): LocalFilesystemScriptResolver {
    const dir = path.join(homedir(), ".redir", "scripts", "local");
    return new LocalFilesystemScriptResolver(dir);
  }

  scriptsDir: string;

  constructor(scriptsDir: string) {
    this.scriptsDir = scriptsDir;
  }

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
      /* tslint:disable:no-bitwise */
      fs.access(fn, fs.constants.F_OK | fs.constants.R_OK, err => (err ? reject(err) : resolve()));
    });
  }

  getScriptFile(name: string): string {
    return path.join(this.scriptsDir, `${name}.js`);
  }
}
