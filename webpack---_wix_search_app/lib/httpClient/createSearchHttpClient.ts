import { createHttpClient } from '@wix/yoshi-flow-editor';
import type { IWixAPI } from '@wix/yoshi-flow-editor';
import application from '../../../.application.json';

const appDefinitionId = application.appDefinitionId;

function getInstance(wixCodeApi: IWixAPI) {
  const instance = wixCodeApi.site.getAppToken?.(appDefinitionId);
  if (!instance) {
    throw new Error('Failed to get app instance');
  }
  return instance;
}

function createAppTokenGetter(wixCodeApi: IWixAPI) {
  return () => getInstance(wixCodeApi);
}

export function createSearchHttpClient({
  wixCodeApi,
  isSSR,
}: {
  wixCodeApi: IWixAPI;
  isSSR: boolean;
}) {
  const getAppToken = createAppTokenGetter(wixCodeApi);
  return createHttpClient({ getAppToken, isSSR });
}
