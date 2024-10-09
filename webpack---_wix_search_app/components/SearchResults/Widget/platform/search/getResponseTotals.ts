import {
  ISearchResponseTotals,
  ISampleResponse,
  SearchDocumentType,
} from '@wix/client-search-sdk';

export const getResponseTotals = (
  samplesResponse: ISampleResponse,
  visibleDocumentTypes: SearchDocumentType[],
): ISearchResponseTotals => {
  const results = samplesResponse.results.filter(({ documentType }) =>
    visibleDocumentTypes.includes(documentType),
  );

  const totalResults = results.reduce((sum, { total }) => sum + total, 0);

  const responseTotals = results.reduce<ISearchResponseTotals>(
    (totals, { documentType, total }) => {
      totals[documentType] = total;
      return totals;
    },
    {
      [SearchDocumentType.All]: totalResults,
    },
  );

  return responseTotals;
};
