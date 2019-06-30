export interface Data {
  toString(): string;
}

export interface Input extends Data {}

export interface Output extends Data {
  toInput(): Promise<Input>;
}

export interface RedirFunction {
  run(input: Promise<Input>, context: any): Promise<Output>;
}
