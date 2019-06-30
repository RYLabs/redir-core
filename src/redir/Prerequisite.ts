import ScriptRef from "./ScriptRef";
import ResultTarget from "./ResultTarget";

export default class Prerequisite {
  scriptRef: ScriptRef;
  resultTarget?: ResultTarget;

  constructor(ref: ScriptRef, resultTarget?: ResultTarget) {
    this.scriptRef = ref;
    this.resultTarget = resultTarget;
  }
}
