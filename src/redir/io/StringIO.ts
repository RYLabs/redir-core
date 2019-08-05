import { Input, Output } from "../types";

export class StringIO implements Output, Input {
  private value: string;

  constructor(value: string) {
    this.value = value;
  }

  promise(): Promise<StringIO> {
    return Promise.resolve(this);
  }

  toInput(): Promise<Input> {
    return this.promise();
  }

  toString(): string {
    return this.value;
  }
}
