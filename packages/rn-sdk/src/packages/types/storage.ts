export interface IStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}
export abstract class StorageBaseLoader {
  protected readonly _store: IStorage;
  public constructor(store: IStorage) {
    this._store = store;
  }
  public abstract load(): void;
  public abstract save(): void;
}
