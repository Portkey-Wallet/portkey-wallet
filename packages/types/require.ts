type isNever<T> = [T] extends [never] ? true : false;

type UnionToIntersection<T> = (T extends any ? (x: T) => void : never) extends (x: infer R) => void ? R : never;

type LastOfUnion<T> = UnionToIntersection<T extends any ? (x: T) => void : never> extends (x: infer L) => void
  ? L
  : never;
type UnionToTuple<T, R extends any[] = []> = isNever<T> extends true
  ? R
  : UnionToTuple<Exclude<T, LastOfUnion<T>>, [LastOfUnion<T>, ...R]>;

type RequireKey<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: T[P];
};

type RequireTupleOne<T, K extends any[], R extends any[] = []> = R['length'] extends K['length']
  ? never
  : RequireKey<T, K[R['length']]> | RequireTupleOne<T, K, [...R, 1]>;

export type RequireAllOne<T> = RequireTupleOne<T, UnionToTuple<keyof T>>;
