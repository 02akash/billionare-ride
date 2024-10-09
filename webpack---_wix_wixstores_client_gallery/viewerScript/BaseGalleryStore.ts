/* eslint-disable @typescript-eslint/no-floating-promises */

import {IControllerConfig} from '@wix/native-components-infra/dist/es/src/types/types';
import {HeadingTags} from '@wix/wixstores-client-core/dist/es/src/types/heading-tags';
import {ProductPriceBreakdown} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/ProductPriceBreakdown/ProductPriceBreakdown';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import _ from 'lodash';
import {ProductOptionType} from '@wix/wixstores-graphql-schema';
import {BI_APP_NAME, BiEventParam, Experiments, origin} from '../constants';
import {actualPrice, isPreOrder} from '@wix/wixstores-client-core/dist/es/src/productOptions/productUtils';
import {ProductsService} from '../services/ProductsService';
import {AddToCartService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/AddToCartService/AddToCartService';
import {
  AddToCartButtonPlacement,
  ButtonContentType,
  IGalleryControllerConfig,
  ImageModeId,
  ImageRatioId,
  IPropsInjectedByViewerScript as IGalleryPropsInjectedByViewerScript,
  LoadMoreType,
  NamePriceLayout,
  PriceAndDiscountLayouts,
  ProductOptionsShowOptionsOption,
  ProductsManifest,
} from '../types/galleryTypes';
import {
  BI_PRODUCT_OPTION_ACTION,
  BI_PRODUCT_OPTION_TYPE,
} from '@wix/wixstores-client-storefront-sdk/dist/es/src/constants';
import {ProductsVariantInfoMap} from '../services/ProductsOptionsService';
import {IPropsInjectedByViewerScript as ISliderGalleryPropsInjectedByViewerScript} from '../types/sliderGalleryTypes';
import {getStylesValues, IStyleParam, StyleParamType} from '@wix/tpa-settings';
import {clickOnProductOptionSf, clickShippingInfoLinkSf} from '@wix/bi-logger-ec-sf/v2';
import {roundStyleParams} from './utils';
import {IStylesParamsValues} from '../styleParams/types';
import {ProductItemsService} from '../services/ProductItemsService';
import {generateGuid} from '@wix/wixstores-client-core/dist/es/src/guid-generator';
import {AddToCartActionOption} from '@wix/wixstores-client-core/dist/es/src/constants';

export abstract class BaseGalleryStore {
  protected config: IGalleryControllerConfig;
  protected readonly publicData: IControllerConfig['publicData'];
  protected readonly impressionId = generateGuid();

  protected productPriceBreakdown: ProductPriceBreakdown;
  protected productsManifest: ProductsManifest = {};
  protected productItemsService: ProductItemsService;
  protected productsService: ProductsService;
  protected addToCartService: AddToCartService;
  protected styles: IStylesParamsValues;
  protected allStyles: IStylesParamsValues[];
  protected abstract get stylesParams();

  constructor(
    config: IControllerConfig,
    protected readonly siteStore: SiteStore,
    protected readonly updateComponent: (
      props: Partial<IGalleryPropsInjectedByViewerScript> | Partial<ISliderGalleryPropsInjectedByViewerScript>
    ) => void,
    protected readonly type: string,
    protected readonly compId: string
  ) {
    this.config = config;
    this.publicData = _.cloneDeep(this.config.publicData);
    this.updateStyles();

    //todo: COMPONENT === null is not tested, be this check can be removed after bolt will stop sending nulls https://wix.slack.com/archives/CAKBA7TDH/p1555852184003900
    /* istanbul ignore next: hard to test */
    if (this.config.publicData.COMPONENT === null || this.config.publicData.COMPONENT === undefined) {
      this.config.publicData.COMPONENT = {};
    }
    this.productItemsService = new ProductItemsService(this.updateComponent);
  }

  protected updateStyles() {
    const {
      style: {styleParams},
      allStyles,
    } = this.config;
    roundStyleParams(styleParams);
    this.styles = getStylesValues(styleParams, this.stylesParams);
    this.allStyles = allStyles.map((styles) => getStylesValues(styles, this.stylesParams));
  }

  protected isTrueInAnyBreakpoint(styleParam: IStyleParam<StyleParamType.Boolean>) {
    return this.allStyles.some((bpStyle) => bpStyle[styleParam.key] === true);
  }

  protected getCommonPropsToInject() {
    return {
      htmlTags: this.htmlTags,
      priceBreakdown: this.priceBreakdown,
      sendClickShippingInfoLinkSf: this.sendClickShippingInfoLinkSf.bind(this),
      imageMode: this.imageMode,
      imageRatio: this.imageRatio,
      isSEO: this.siteStore.seo.isInSEO(),
    };
  }

  protected abstract reportProductItemClick({productId, index}: {productId: string; index: number});

  protected sendClickShippingInfoLinkSf(productId: string) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.siteStore.webBiLogger.report(clickShippingInfoLinkSf({productId}));
  }

  protected getCommonPropsToUpdate() {
    const htmlTags = this.htmlTags;
    const productsVariantInfoMap = this.productsVariantInfoMap;
    const imageMode = this.imageMode;
    const imageRatio = this.imageRatio;

    return {htmlTags, productsVariantInfoMap, imageMode, imageRatio};
  }

  protected get priceBreakdown() {
    return {
      shouldRenderTaxDisclaimer: this.productPriceBreakdown.shouldShowTaxDisclaimer,
      shippingDisclaimer: this.productPriceBreakdown.shippingDisclaimer,
      taxDisclaimer: this.productPriceBreakdown.taxDisclaimer,
    };
  }

  protected get imageMode(): ImageModeId {
    return this.styles.gallery_imageMode;
  }

  protected get imageRatio(): ImageRatioId {
    return this.styles.galleryImageRatio;
  }

  protected get htmlTags() {
    const defaultProductNameHtmlTag = this.siteStore.experiments.enabled(Experiments.GalleryA11yFixes)
      ? HeadingTags.P
      : HeadingTags.H3;
    return {
      productNameHtmlTag: this.publicData.COMPONENT.gallery_productNameHtmlTag
        ? this.publicData.COMPONENT.gallery_productNameHtmlTag
        : defaultProductNameHtmlTag,
      headerTextHtmlTag: this.publicData.COMPONENT.gallery_headerTextHtmlTag || HeadingTags.H2,
      categoriesFiltersHtmlTag: this.publicData.COMPONENT.gallery_categoriesFiltersHtmlTag || HeadingTags.H2,
      categoryPageHeaderHtmlTag: this.publicData.COMPONENT.gallery_categoryPageHeaderHtmlTag || HeadingTags.H1,
    };
  }

  protected async handleOptionSelectionsChange(params: {
    productId: string;
    selectionIds: number[];
    optionType: ProductOptionType;
  }) {
    if (this.getIsOptionsRevealEnabled()) {
      this.productsService.clearSelections();
    }

    await this.productsService.handleProductsOptionsChange({
      ...params,
      ...(this.siteStore.experiments.enabled(Experiments.GalleryProductItemsLazyLoadingForV3) && {
        productsManifest: this.productsManifest,
      }),
    });

    const {product, variant} = this.productsService.getProductAndVariantById(
      params.productId,
      this.shouldRemoveModifiersSelectionIdsFromUserSelections
    );

    this.productsManifest[product.id].addToCartState = this.addToCartService.getButtonState({
      price: actualPrice(product),
      inStock: product.isInStock,
      isPreOrderState: isPreOrder(product, variant),
    });

    this.updateComponent({
      productsManifest: this.productsManifest,
      productsVariantInfoMap: this.productsVariantInfoMap,
      productsPriceRangeMap: this.productsService.productPriceRangeMap,
    });

    this.sendClickOnProductOptionBiEvent(params);
  }

  protected getIsOptionsRevealEnabled(): boolean {
    const productOptionsShowOptions = this.styles.gallery_productOptionsShowOptions;

    return (
      !this.siteStore.isMobile() &&
      productOptionsShowOptions === ProductOptionsShowOptionsOption.REVEAL &&
      this.siteStore.experiments.enabled(Experiments.GalleryProductOptionsVisibilitySettings)
    );
  }

  protected getStyleParamByDevice<T>(mobileStyleParam: T, defaultStyleParam: T, experimentEnabled = true): T {
    if (experimentEnabled && this.siteStore.isMobile() && mobileStyleParam !== undefined) {
      return mobileStyleParam;
    }
    return defaultStyleParam;
  }

  private sendClickOnProductOptionBiEvent(params: {productId: string; optionType: ProductOptionType}) {
    const {productId, optionType} = params;

    const optiontype = (
      {
        [ProductOptionType.DROP_DOWN]: BI_PRODUCT_OPTION_TYPE.LIST,
        [ProductOptionType.COLOR]: BI_PRODUCT_OPTION_TYPE.COLOR,
      } as const
    )[optionType];

    const {productType} = this.productsService.getProduct(productId);

    this.siteStore.webBiLogger.report(
      clickOnProductOptionSf({
        action: BI_PRODUCT_OPTION_ACTION.CHECKED,
        appName: BI_APP_NAME,
        optiontype,
        productId,
        productType,
        origin,
        viewMode: this.siteStore.biStorefrontViewMode,
      })
    );
  }

  protected get shouldRemoveModifiersSelectionIdsFromUserSelections(): boolean {
    return this.siteStore.experiments.enabled(Experiments.ShouldRemoveModifiersSelectionIdsFromUserSelections);
  }

  protected get productsVariantInfoMap(): ProductsVariantInfoMap {
    return this.shouldShowProductOptions
      ? this.productsService.getVariantInfoMap(this.shouldRemoveModifiersSelectionIdsFromUserSelections)
      : {};
  }

  protected get commonViewGallerySfParams() {
    const {gallery_loadMoreProductsType, gallery_showPrice, showQuickView, gallery_hoverType} = this.styles;

    const loadType = {
      [LoadMoreType.BUTTON]: BiEventParam.LoadMore,
      [LoadMoreType.PAGINATION]: BiEventParam.Pagination,
      [LoadMoreType.INFINITE]: BiEventParam.InfiniteScroll,
    }[gallery_loadMoreProductsType];

    return {
      type: this.type,
      component_id: this.compId,
      isMobileFriendly: this.siteStore.isMobileFriendly,
      addToCart: this.getStyleParamByDevice(
        this.styles['mobile:gallery_showAddToCartButton'],
        this.styles.gallery_showAddToCartButton
      ),
      navigationClick: this.biNavigationClick,
      hasPrice: gallery_showPrice,
      hasQuantity: this.getStyleParamByDevice(
        this.styles['mobile:gallery_showQuantity'],
        this.styles.gallery_showAddToCartQuantity
      ),
      priceBreakdown: this.productPriceBreakdown.priceBreakdownBIParam,
      hasQuickView: showQuickView,
      hoverType: gallery_hoverType.value,
      loadType,
      impressionId: this.impressionId,
    };
  }

  protected get commonViewGallerySfSettingsParams() {
    const {
      gallery_addToCartButtonPlacement,
      gallery_addToCartButtonContentType,
      gallery_priceAndDiscountLayout,
      gallery_namePriceLayout,
    } = this.styles;

    return {
      layoutSettings: {
        addToCartPlacement: _.startCase(AddToCartButtonPlacement[gallery_addToCartButtonPlacement]),
        addToCartButtonContentType: _.startCase(ButtonContentType[gallery_addToCartButtonContentType]),
        priceAndDiscountLayout: _.startCase(_.camelCase(PriceAndDiscountLayouts[gallery_priceAndDiscountLayout])),
        nameAndPriceLayout: _.startCase(NamePriceLayout[gallery_namePriceLayout]),
      },
      displaySettings: {},
      settings: {},
    };
  }

  private get biNavigationClick(): string {
    const {gallery_showAddToCartButton, gallery_addToCartAction} = this.styles;
    if (!gallery_showAddToCartButton) {
      return '';
    } else if (gallery_addToCartAction === AddToCartActionOption.MINI_CART) {
      return 'mini-cart';
    } else if (gallery_addToCartAction === AddToCartActionOption.CART) {
      return 'cart';
    }
    return 'none';
  }

  protected abstract get shouldShowProductOptions(): boolean;
}
