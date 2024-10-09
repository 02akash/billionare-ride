import { Experiments } from '@wix/yoshi-flow-editor';
import { ISampleResponse, SearchDocumentType } from '@wix/client-search-sdk';
import { AppSettings } from '@wix/search-settings-client';

import { getVisibleDocumentTypes } from '../../../../../lib/documentTypes';

export const getDocumentTypes = (
  samplesResponse: ISampleResponse,
  appSettings: AppSettings,
  experiments: Experiments,
): SearchDocumentType[] => {
  const availableDocumentTypes = samplesResponse.results
    .filter(({ total }) => !!total)
    .map(({ documentType }) => documentType);

  availableDocumentTypes.push(SearchDocumentType.All);

  const visibleDocumentTypes = getVisibleDocumentTypes(
    availableDocumentTypes,
    appSettings.categoryList,
  );

  // Remove All tab when only All + Something is visible
  if (
    visibleDocumentTypes.length === 2 &&
    visibleDocumentTypes.includes(SearchDocumentType.All)
  ) {
    visibleDocumentTypes.splice(
      visibleDocumentTypes.indexOf(SearchDocumentType.All),
      1,
    );
  }

  return visibleDocumentTypes;
};
