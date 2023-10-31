export interface BaseJSModule {
  [x: string | symbol]: <T extends BaseMethodParams>(params: T) => Promise<void>;
}

export interface BaseMethodParams {
  eventId: string;
}
