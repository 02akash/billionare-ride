export const query = `query getCategoryInitialData($externalId: String!, $currentCategoryId: String!) {
  appSettings(externalId: $externalId) {
    widgetSettings
  }
  catalog {
    filters(enabledFilters: "CATEGORY") {
      filterType
      name
      field
      values {
        key
        value
      }
    }
    categories {
      list {
        id
        name
        slug
        visible
        parentCategoryId
        parentCategoryIndex
      }
    }
    category(categoryId: $currentCategoryId) {
      id
      name
      slug
      visible
      numOfProducts
      description
      media {
        url
        fullUrl
        mediaType
        width
        height
      }
      breadcrumbs {
        id
        name
        slug
      }
      seoData
      parentCategoryId
      parentCategoryIndex
      
    }
    allProductsCategoryId
  }
}
`;
