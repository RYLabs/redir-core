import fetch from '../util/fetch';
import Logger from 'nightingale-logger';
import { Context, Output } from '../types';
import { ScriptOptions } from '../Script';
import { StringArrayIO, StringIO } from '../io';

const logger = new Logger("redir:result:fetch");

export default async (result: Promise<Output>, context: Context, options: ScriptOptions): Promise<Output> => {
  if (options.fetch !== true) {
    return result;
  }
  const output = await result,
    stringOutput = output.toString(),
    request = JSON.parse(stringOutput);
  return fetch(request).then(data => (Array.isArray(data) ? new StringArrayIO(data) : new StringIO(data)));
};
