import { Context, UserAgent } from "./types";

export class DefaultContext implements Context {
  userAgent?: UserAgent;

  constructor(userAgent?: UserAgent) {
    this.userAgent = userAgent;
  }
}
