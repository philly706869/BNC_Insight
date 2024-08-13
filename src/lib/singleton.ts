declare const globalThis: {
  singletons: Record<string, any>;
};

export async function singleton<Type>(
  id: string,
  constructor: () => Type
): Promise<Awaited<Type>> {
  if (!globalThis.singletons[id]) {
    globalThis.singletons[id] = await constructor();
  }
  return globalThis.singletons[id];
}
