import { unstable_cache } from "next/cache";
import { deserialize, serialize } from "superjson";

export async function cacheList<T>(query: () => Promise<T[]>, keys: Parameters<typeof unstable_cache>[1], opts: Parameters<typeof unstable_cache>[2]): Promise<T[]> {
  const cached = unstable_cache(
    async () => {
      const result = (await query()).map((x) => (x as any).get({ plain: true })) as T[];
      return serialize(result);
    },
    keys,
    opts
  );

  const { json, meta } = await cached();

  const result = deserialize<T[]>({ json, meta });
  return result;
}

export async function cacheObj<T>(query: () => Promise<T | null>, keys: Parameters<typeof unstable_cache>[1], opts: Parameters<typeof unstable_cache>[2]): Promise<T> {
  const cached = unstable_cache(
    async () => {
      const result = await query();
      if (result) {
        return serialize((result as any).get({ plain: true }) as T);
      }
      return null;
    },
    keys,
    opts
  );

  const resultSJ = await cached();
  if (resultSJ) {
    const { json, meta } = resultSJ;
    const result = deserialize<T>({ json, meta });
    return result;
  }
  return null as T;
}

// export const cache = async <T, P extends unknown[]>(
//   fn: (...params: P) => Promise<T>,
//   keys: Parameters<typeof unstable_cache>[1],
//   opts: Parameters<typeof unstable_cache>[2],
// ) => {
//   const wrap = async (params: unknown[]) => {
//     const result = await fn(...(params as P));
//     return serialize(result);
//   };

//   const cachedFn = unstable_cache(wrap, keys, opts);

//   return async (...params: P): Promise<T> => {
//     const { json, meta } = await cachedFn(params);
//     const result = deserialize<T>({ json, meta})
//     return result;
//   };
// };
