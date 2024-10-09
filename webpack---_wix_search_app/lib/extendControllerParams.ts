import { ClientSearchSDK, SearchDocumentType } from '@wix/client-search-sdk';
import { createSettingsClient } from '@wix/search-settings-client';
import type { ControllerParams } from '@wix/yoshi-flow-editor';
import { Spec } from '@wix/site-search-common';

import { IExtendedControllerParams } from './platform.types';
import { createSearchLocation } from './location';
import { reportError } from './errors';
import { getHttpClient } from './httpClient';

export const extendControllerParams = (
  params: ControllerParams,
): IExtendedControllerParams => {
  const { flowAPI, controllerConfig } = params;
  const { wixCodeApi } = controllerConfig;
  const { environment, errorMonitor, experiments } = flowAPI;
  const { isViewer, language } = environment;
  const siteBaseUrl = wixCodeApi.location.baseUrl;
  const httpClient = getHttpClient(params);

  const settingsClient = createSettingsClient({
    httpClient,
  });

  const getAppSettings = async () => {
    try {
      const appSettings = isViewer
        ? await settingsClient.getPublished()
        : await settingsClient.getSaved();

      return appSettings;
    } catch (error) {
      reportError(errorMonitor, error);
      return settingsClient.getDefault();
    }
  };

  const searchLocation = createSearchLocation(wixCodeApi);

  const searchSDK = new ClientSearchSDK({
    httpClient,
    siteBaseUrl,
    language,
    timeout: 25000,
    excludeDocumentTypes: experiments.enabled(Spec.ProGallery)
      ? undefined
      : [SearchDocumentType.ProGallery],
    useVespaEndpoints: experiments.enabled(Spec.VespaSiteSearchEndpoints),
    useRawProductDocuments: experiments.enabled(
      Spec.SearchResultsPageProductsSlot,
    ),
  });

  return {
    ...controllerConfig,
    getAppSettings,
    searchLocation,
    searchSDK,
    flowAPI,
  };
};
