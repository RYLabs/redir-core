import Script from "./Script";
import { Redir, Output, Input } from "./types";

export default class ProcessUnit implements Redir {
  constructor(script: Script) {}

  run(input: Promise<Input>, context: any): Promise<Output> {
    throw new Error("Method not implemented.");
  }
}
