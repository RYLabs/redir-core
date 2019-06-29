import Output from "./Output";

export default class StringOutput implements Output {
  value: string;

  constructor(value: string) {
    this.value = value;
  }
}
