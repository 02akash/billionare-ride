export const facets = {
  categoryTitle: { type: 'property', limit: 10 },
  contentType: {
    type: 'property',
    limit: 10,
    refreshOnDependentFacetChange: true,
    serializerConfig: {
      convertToLowercaseInLocation: true,
    },
  },
} as const;
