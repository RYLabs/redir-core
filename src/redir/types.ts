export interface Data {}

export interface Input {}

export interface Output {}

export interface RedirFunction {
  run(input: Promise<Input>, context: any): Promise<Output>;
}
