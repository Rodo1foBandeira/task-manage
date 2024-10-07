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
