export interface Data {
  toString(): string;
}

export interface Input extends Data {}

export interface Output extends Data {
  toInput(): Promise<Input>;
}

export type RedirFunction = (input: Promise<Input>, context: Context) => Promise<Output>;

export interface Runnable {
  run: RedirFunction;
}

export interface UserAgent {}

export interface Context {
  [key: string]: any;
  userAgent?: UserAgent;
}
