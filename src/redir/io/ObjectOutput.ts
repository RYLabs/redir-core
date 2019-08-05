import { Input, Output } from '../types';
import { StringIO } from './StringIO';

export class ObjectOutput implements Output {
  private value: any;

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