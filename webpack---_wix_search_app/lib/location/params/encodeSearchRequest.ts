import { availableFacets } from '../../../integrations';
import { entries, assertUnreachable } from '../../../utils';
import {
  FacetDescriptor,
  FacetFilterValueMap,
} from '../../../types/core/facets';
import {
  ILocationSearchRequest,
  IEncodedSearchQueryParams,
} from '../location.types';

import {
  encodeQuery,
  encodeDocumentType,
  encodePage,
  encodeSort,
} from './serializers';

export function encodeSearchRequestToQueryParams(
  request: ILocationSearchRequest,
): IEncodedSearchQueryParams {
  const q = encodeQuery(request.query);
  const type = encodeDocumentType(request.documentType);
  const page = encodePage(request.page);
  const sort = encodeSort(request.sort);

  const facetFiltersParams = entries(request.facetsFilters || {}).reduce(
    (params, [key, value]) => {
      const facetDescriptor = availableFacets[key];

      if (facetDescriptor) {
        switch (facetDescriptor.type) {
          case 'minMaxAggregation': {
            const val =
              value as FacetFilterValueMap[typeof facetDescriptor.type];

            if (val?.min || val?.max) {
              params[key] = `${val.min || ''}-${val.max || ''}`;
            }
            break;
          }
          case 'category': {
            const val =
              value as FacetFilterValueMap[typeof facetDescriptor.type];

            if (val && val.length > 0) {
              params[key] = val.sort().join(',');
            }
            break;
          }
          case 'property': {
            const val =
              value as FacetFilterValueMap[typeof facetDescriptor.type];

            if (val) {
              params[key] = (facetDescriptor as FacetDescriptor)
                .serializerConfig?.convertToLowercaseInLocation
                ? val?.toLocaleLowerCase()
                : val;
            }

            break;
          }
          default:
            assertUnreachable(facetDescriptor);
        }
      }

      return params;
    },
    {} as Record<string, string>,
  );

  return {
    ...(q !== undefined && { q }),
    ...(type !== undefined && { type }),
    ...(page !== undefined && { page }),
    ...facetFiltersParams,
    ...(sort !== undefined && { sort }),
  };
}
