import { Script } from "./Script";

export interface Input {
  toString(): string;
}

export interface Output {
  toString(): string;
  toInput(): Promise<Input>;
}

export type RedirFunction = (input: Promise<Input>, context: Context) => Promise<Output>;

export interface Runnable {
  run: RedirFunction;
}

export interface UserAgent {
  readonly name: string;
}

export interface Context {
  [key: string]: any;
  userAgent?: UserAgent;
}

export interface ScriptRef {
  name: string;
  loadScript(): Promise<Script>;
}
