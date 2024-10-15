export const simulateDelay = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(1), 2000);
  });
};

export function objToURLSearchParams(obj: Record<string, any>): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Se o valor for uma array, adicionar cada item individualmente
      value.forEach((item) => params.append(key, item));
    } else if (value !== undefined && value !== null) {
      // Caso contrário, adicionar o valor diretamente
      params.append(key, value);
    }
  });

  return params;
}

export function urlSearchParamsToObj<T extends object>(queryString: string): T {
  const searchParams = new URLSearchParams(queryString);
  const result = {} as T;

  searchParams.forEach((value, key) => {
    // Verifica se o parâmetro é um array tipo tarsExps[3]
    const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/);

    if (arrayMatch) {
      const [_, paramName, index] = arrayMatch;
      if (!(paramName in result)) {
        (result as any)[paramName] = {};
      }
      (result as any)[paramName][index] = isNaN(+value) ? true : +value;
    } else {
      // Converte valores numéricos para números, se aplicável
      (result as any)[key] = isNaN(+value) ? value : +value;
    }
  });

  return result;
}