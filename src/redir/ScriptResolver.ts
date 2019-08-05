import { ScriptRef } from "./types";

export interface ScriptResolver {
  resolve(name: string): Promise<ScriptRef>;
}

export async function resolveAll(resolver: ScriptResolver, refs?: string[]): Promise<ScriptRef[]> {
  if (refs) {
    const promises = refs.map((req: string): Promise<ScriptRef> => resolver.resolve(req));
    return await Promise.all(promises);
  } else {
    return Promise.resolve([]);
  }
}
