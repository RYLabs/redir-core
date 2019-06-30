import { Output } from "./types";

export class StringOutput implements Output {
  value: string;

  constructor(value: string) {
    this.value = value;
  }
}

export class StringArrayOutput implements Output {
  value: string[];

  constructor(value: string[]) {
    this.value = value;
  }
}
