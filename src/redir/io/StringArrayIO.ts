import { Input, Output } from '../types';

export class StringArrayIO implements Output, Input {
  private value: string[];

  constructor(value: string[]) {
    this.value = value;
  }

  promise(): Promise<StringArrayIO> {
    return Promise.resolve(this);
  }

  toInput(): Promise<Input> {
    return this.promise();
  }

  toString(): string {
    return this.value.join("\n");
  }
}