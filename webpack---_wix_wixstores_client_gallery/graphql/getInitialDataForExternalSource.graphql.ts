export const query = `query getInitialDataForExternalSource($externalId: String!) {
  appSettings(externalId: $externalId) {
      widgetSettings
    }
  catalog {
    allProductsCategoryId
  }
}
`;
