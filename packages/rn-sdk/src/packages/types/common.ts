type GenerateType<T> = {
  [K in keyof T]: T[K];
};

export type PartialOption<T, K extends keyof T> = GenerateType<Partial<Pick<T, K>> & Omit<T, K>>;
