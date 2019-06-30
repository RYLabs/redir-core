import { Redir } from "./redir/Redir";
import fetch from "./redir/result/fetch";
import netrc from "./redir/context/netrc";

const redir = new Redir();
redir.resultProcessors.push(fetch);
redir.contextProcessors.push(netrc);

  //run(input: Promise<Input>, context: any): Promise<Output> {
  //  return this.createPipeline().run(input, context);
  //}