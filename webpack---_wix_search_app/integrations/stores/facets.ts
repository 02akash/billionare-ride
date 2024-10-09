export const facets = {
  price: {
    type: 'minMaxAggregation',
    serializerConfig: { facetNameForApi: 'discountedPriceNumeric' },
    refreshOnDependentFacetChange: true,
  },
  collections: {
    type: 'category',
    limit: 999,
    refreshOnDependentFacetChange: true,
  },
} as const;
