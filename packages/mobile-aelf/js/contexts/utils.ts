export function basicActions<T extends string>(type: T, payload?: any) {
  return {
    type,
    payload,
  };
}
export type BasicActions<T = string> = {
  dispatch: (actions: { type: T; payload: any }) => void;
};
