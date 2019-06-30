export interface Data {}

export interface Input {}

export interface Output {}

export interface Redir {
  run(input: Promise<Input>, context: any): Promise<Output>;
}
