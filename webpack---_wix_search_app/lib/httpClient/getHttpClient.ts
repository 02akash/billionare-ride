import type { ControllerParams } from '@wix/yoshi-flow-editor';
import { createSearchHttpClient } from './createSearchHttpClient';
import { Spec } from '@wix/site-search-common';

export function getHttpClient(params: ControllerParams) {
  const { flowAPI, controllerConfig } = params;
  const { httpClient, environment, experiments } = flowAPI;
  const useSearchHttpClient = experiments.enabled(Spec.useSearchHttpClient);
  if (!useSearchHttpClient) {
    return httpClient;
  }
  const { wixCodeApi } = controllerConfig;
  const { isSSR } = environment;
  return createSearchHttpClient({ wixCodeApi, isSSR });
}
