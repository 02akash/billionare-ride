// @ts-expect-error
export function assertUnreachable(val: never): never {
  // eslint-disable-next-line no-console
  console.log(`Unhandled switch case ${JSON.stringify(val)}`);
}

export const keys: <T extends Object, K extends keyof T>(o: T) => K[] =
  Object.keys;

export const entries: <T extends Object, K extends keyof T>(
  o: T,
) => [K, T[K]][] = Object.entries;
