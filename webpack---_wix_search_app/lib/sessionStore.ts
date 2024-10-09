import { IPlatformAPI, IWebStorage } from '@wix/yoshi-flow-editor';

export enum SessionStoreKey {
  BiSuggestionsCorrelation = 'Bi:SuggestionsCorrelation',
  BiSearchCorrelation = 'Bi:SearchCorrelation',
  BiSearchOrigin = 'Bi:SearchOrigin',
  ScrollToWidget = 'ScrollToWidget',
}

export class SessionStore {
  private readonly storage: IWebStorage;

  constructor(platformApi: IPlatformAPI) {
    this.storage = platformApi.storage.session;
  }

  set(key: SessionStoreKey, value: string): void {
    this.storage.setItem(key, value);
  }

  get(key: SessionStoreKey): string {
    return this.storage.getItem(key) || '';
  }

  remove(key: SessionStoreKey): void {
    this.storage.removeItem(key);
  }

  has(key: SessionStoreKey): boolean {
    return this.storage.getItem(key) !== null;
  }
}
