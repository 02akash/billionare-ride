export var SPECS;
(function(SPECS) {
    SPECS["USE_LIGHTBOXES"] = "specs.stores.UseLightboxes";
    SPECS["USE_ADD_CUSTOM_ITEMS_TO_CART_GRAPHQL_MUTATION"] = "specs.stores.UseAddCustomItemsToCartGraphQLMutation";
    SPECS["AllowMobileTinyCartInViewer"] = "specs.stores.AllowMobileTinyCartInViewer";
    SPECS["ShouldUseOnlyBaseUrlAsOrigin"] = "specs.stores.ShouldUseOnlyBaseUrlAsOrigin";
    SPECS["ShouldUseOnlyPlatformExperiments"] = "specs.stores.ShouldUseOnlyPlatformExperiments";
    SPECS["useCacheInEditorForSiteConfig"] = "specs.stores.useCacheInEditorForSiteConfig";
    SPECS["AvoidLoadingMiniCartForDisabledSites"] = "specs.stores.AvoidLoadingMiniCartForDisabledSites";
    SPECS["dummySpec"] = "ThisIsADummySpec";
    SPECS["IncreaseGqlGetLimit"] = "specs.stores.increaseGqlGetLimit";
    SPECS["fixEmailNotifierInCart"] = "specs.stores.fixEmailNotifierInCart";
    SPECS["NavigateToRelativeUrlWithCustomizedUrl"] = "specs.stores.navigateToRelativeUrlWithCustomizedUrl";
    SPECS["ShouldPreloadCurrentCart"] = "specs.stores.ShouldPreloadCurrentCart";
    SPECS["ShouldInstallSideCart"] = "specs.stores.ShouldInstallSideCart";
    SPECS["ShouldUseSideCart"] = "specs.stores.ShouldUseSideCart";
    SPECS["ShouldForceNavigateToProductPage"] = "specs.stores.shouldForceNavigateToProductPage";
    SPECS["ShouldSetTimeoutAfterAddToCart"] = "specs.stores.ShouldSetTimeoutAfterAddToCart";
    SPECS["ShouldSet100msTimeoutAfterAddToCart"] = "specs.stores.ShouldSet100msTimeoutAfterAddToCart";
    SPECS["AddCheckoutSettingsToGetConfigGQLQuery"] = "specs.stores.AddCheckoutSettingsToGetConfigGQLQuery";
    SPECS["NavigateToCartWhenDontShowSideCartOnMobile"] = "specs.stores.NavigateToCartWhenDontShowSideCartOnMobile";
})(SPECS || (SPECS = {}));
export var BI_STOREFRONT_VIEW_MODE;
(function(BI_STOREFRONT_VIEW_MODE) {
    BI_STOREFRONT_VIEW_MODE["SITE"] = "site";
    BI_STOREFRONT_VIEW_MODE["PREVIEW"] = "preview";
    BI_STOREFRONT_VIEW_MODE["EDITOR"] = "editor";
})(BI_STOREFRONT_VIEW_MODE || (BI_STOREFRONT_VIEW_MODE = {}));
export var BI_PRODUCT_OPTION_TYPE;
(function(BI_PRODUCT_OPTION_TYPE) {
    BI_PRODUCT_OPTION_TYPE["COLOR"] = "color";
    BI_PRODUCT_OPTION_TYPE["LIST"] = "list";
})(BI_PRODUCT_OPTION_TYPE || (BI_PRODUCT_OPTION_TYPE = {}));
export var BI_PRODUCT_OPTION_ACTION;
(function(BI_PRODUCT_OPTION_ACTION) {
    BI_PRODUCT_OPTION_ACTION["CHECKED"] = "checked";
    BI_PRODUCT_OPTION_ACTION["UNCHECKED"] = "unchecked";
})(BI_PRODUCT_OPTION_ACTION || (BI_PRODUCT_OPTION_ACTION = {}));
export var ONE_HUNDRED_THOUSAND = 100000;
export var DEFAULT_CART_OPTIONS = {
    withShipping: false,
    withTax: false
};
export var VIEW_MORE_OPTIONS_URL_FRAGMENT = 'view-more-options';
//# sourceMappingURL=constants.js.map