import { Input, Output } from "./types";

export class StringIO implements Output, Input {
  value: string;

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

export class StringArrayIO implements Output, Input {
  value: string[];

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

export class ObjectOutput implements Output {
  value: any;

  constructor(value: any) {
    this.value = value;
  }

  toString(): string {
    return JSON.stringify(this.value);
  }

  toInput(): Promise<Input> {
    return Promise.resolve(new StringIO(this.toString()));
  }

  promise(): Promise<ObjectOutput> {
    return Promise.resolve(this);
  }
}

export const emptyInput = new StringIO("");
export const emptyOutput = emptyInput;
