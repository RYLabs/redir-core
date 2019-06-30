import { Input } from "./types";

class EmptyInput implements Input {
  promise(): Promise<Input> {
    return Promise.resolve(this);
  }
}

export const emptyInput = new EmptyInput();
