import { ScriptRef } from "./types";
import { ResultTarget } from "./ResultTarget";

export class Prerequisite {
  scriptRef: ScriptRef;
  resultTarget?: ResultTarget;

  constructor(ref: ScriptRef, resultTarget?: ResultTarget) {
    this.scriptRef = ref;
    this.resultTarget = resultTarget;
  }
}