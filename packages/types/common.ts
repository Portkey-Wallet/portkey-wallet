export type GenerateType<T> = {
  [K in keyof T]: T[K];
};

export type PartialOption<T, K extends keyof T> = GenerateType<Partial<Pick<T, K>> & Omit<T, K>>;

export type RequireAtLeastOne<T, R extends keyof T = keyof T> = Omit<T, R> &
  { [P in R]: Required<Pick<T, P>> & Partial<Omit<T, P>> }[R];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];
