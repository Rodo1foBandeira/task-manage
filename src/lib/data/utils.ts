import { unstable_cache } from "next/cache";
import { Model } from "sequelize";
import { deserialize, serialize } from "superjson";

export async function cacheList<T>(query: () => Promise<Model<any, any>[]>, keys: Parameters<typeof unstable_cache>[1], opts: Parameters<typeof unstable_cache>[2]): Promise<T[]> {
  const cached = unstable_cache(
    async () => {
      // Converte cada resultado para um objeto plano (JSON)
      const result = (await query()).map((x) => x.get({ plain: true })) as T[];
      return serialize(result); // Serialização antes de cachear
    },
    keys,
    opts
  );

  const { json, meta } = await cached();

  // Deserializa o cache para retornar o resultado tipado corretamente
  const result = deserialize<T[]>({ json, meta });
  return result;
}

export async function cacheObj<T>(query: () => Promise<Model | null>, keys: Parameters<typeof unstable_cache>[1], opts: Parameters<typeof unstable_cache>[2]): Promise<T | null> {
  const cached = unstable_cache(
    async () => {
      const result = await query();
      if (result) {
        // Converte para objeto plano se for um Model do Sequelize
        const plainResult = (result as Model).get({ plain: true });
        return serialize(plainResult) // Certifique-se de que o tipo final seja T
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

  return null;
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
