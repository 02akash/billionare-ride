export var query = "query getConfig($withPremiumFeatures: Boolean!, $language: String!, $countryKeys: [String!]) {\n  clientConfig {\n    language\n    layoutDirection\n    storeCurrency\n  }\n  experiments {\n    name\n    value\n  }\n  premiumFeatures @include(if: $withPremiumFeatures) {\n    name\n  }\n  priceSettings {\n    showPriceRange\n    taxOnProduct\n    showTaxDisclaimer\n    shippingDisclaimer {\n      show\n      displayText\n      additionalInfo {\n        show\n        title\n        description\n      }\n    }\n  }\n  localeData(language: $language) {\n    countries(keys: $countryKeys) {\n      properties(withFallback: true) {\n        taxName\n      }\n    }\n  }\n  checkoutSettings {\n    delayCaptureEnabled\n  }\n}\n";
//# sourceMappingURL=getClientConfig.graphql.js.map