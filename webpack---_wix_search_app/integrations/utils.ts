import { SearchDocumentType } from '@wix/client-search-sdk';
import { allFacets, AvailableFacets, facetNameToApiName } from '.';
import { entries, assertUnreachable } from '../utils';
import { FacetApiDescriptors } from '../types/core/facets';

export const convertFacetDescriptorsToApiFacets = (
  facetDescriptors: AvailableFacets,
): FacetApiDescriptors => {
  return entries(facetDescriptors).reduce(
    (facetDescriptorsForApi, [facetName, descriptor]) => {
      const name = facetNameToApiName[facetName];
      switch (descriptor.type) {
        case 'category':
        case 'property': {
          facetDescriptorsForApi.facets.clauses.push({
            term: {
              name,
              limit: descriptor.limit,
            },
          });
          break;
        }
        case 'minMaxAggregation': {
          facetDescriptorsForApi.facets.clauses.push(
            {
              aggregation: {
                name,
                aggregation: 'MIN',
              },
            },
            {
              aggregation: {
                name,
                aggregation: 'MAX',
              },
            },
          );
          break;
        }
        default:
          assertUnreachable(descriptor);
      }
      return facetDescriptorsForApi;
    },
    { facets: { clauses: [] } } as FacetApiDescriptors,
  );
};

export const getFacetDescriptorsByDocumentType = (
  documentType: SearchDocumentType | undefined,
): AvailableFacets | undefined => {
  return allFacets[documentType as keyof typeof allFacets] as AvailableFacets;
};
