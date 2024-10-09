import decodeUriComponent from 'decode-uri-component';
import {
  availableFacets,
  FacetFilterValue,
  PermissiveFacetFilterValue,
} from '../../../integrations';
import { entries, assertUnreachable } from '../../../utils';
import { FacetDescriptor } from '../../../types/core/facets';
import {
  ILocationSearchRequest,
  IEncodedSearchPathParams,
  IEncodedSearchQueryParams,
} from '../location.types';

import {
  decodeQuery,
  decodeQueryFromPath,
  decodeDocumentType,
  decodePage,
  decodeSort,
} from './serializers';

export function decodeSearchRequestFromPathParams(
  params: IEncodedSearchPathParams,
): ILocationSearchRequest {
  const query = decodeQueryFromPath(params.q);
  const documentType = decodeDocumentType(params.qc);
  const page = decodePage(params.page);

  return {
    ...(query !== undefined && { query }),
    ...(documentType !== undefined && { documentType }),
    ...(page !== undefined && { page }),
  };
}

export function decodeSearchRequestFromQueryParams(
  params: IEncodedSearchQueryParams,
): ILocationSearchRequest {
  const query = decodeQuery(params.q);
  const documentType = decodeDocumentType(params.type);

  const facetsFilters = entries(availableFacets).reduce(
    (facetsFilter, [facetName, facetDescriptor]) => {
      const value: string | undefined = (params as Record<string, string>)[
        facetName
      ];
      if (value) {
        switch (facetDescriptor.type) {
          case 'minMaxAggregation': {
            const [min, max] = value.split('-');
            const parsedMin = parseInt(min, 10);
            const parsedMax = parseInt(max, 10);
            if (!isNaN(parsedMin) || !isNaN(parsedMax)) {
              facetsFilter[facetName] = {
                min: !isNaN(parsedMin) ? parsedMin : undefined,
                max: !isNaN(parsedMax) ? parsedMax : undefined,
              };
            }
            break;
          }
          case 'category': {
            facetsFilter[facetName] = value
              ? decodeUriComponent(value).split(',')
              : undefined;
            break;
          }
          case 'property': {
            facetsFilter[facetName] = (facetDescriptor as FacetDescriptor)
              .serializerConfig?.convertToLowercaseInLocation
              ? value.toLocaleUpperCase()
              : value;
            break;
          }
          default:
            assertUnreachable(facetDescriptor);
        }
        return facetsFilter;
      }
      return facetsFilter;
    },
    {} as PermissiveFacetFilterValue,
  ) as FacetFilterValue;

  const page = decodePage(params.page);
  const sort = decodeSort(params.sort);

  return {
    ...(query !== undefined && { query }),
    ...(documentType !== undefined && { documentType }),
    ...(page !== undefined && { page }),
    ...(sort !== undefined && { sort }),
    ...(Object.keys(facetsFilters).length > 0 ? { facetsFilters } : undefined),
  };
}
