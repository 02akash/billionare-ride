import { IWixAPI } from '@wix/yoshi-flow-editor';
import { ISearchProductDocument } from '@wix/client-search-sdk';

export const addProductToCart = async (
  { id, relativeUrl }: ISearchProductDocument,
  wixCodeApi: IWixAPI,
): Promise<void> => {
  const {
    stores: storesApi,
    location: locationApi,
    window: windowApi,
  } = wixCodeApi;

  if (!storesApi) {
    return;
  }

  const isMobile = windowApi.formFactor === 'Mobile';

  // NOTE: We cannot add directly to cart when product has options, custom text fields or
  // subscriptions. As a workaround, we show a quickview on desktop and redirect to product
  // page on mobile.
  try {
    const currentCart = await storesApi.cart.getCurrentCart();

    await storesApi.cart.addProducts([{ productId: id, quantity: 1 }]);

    const updatedCart = await storesApi.cart.getCurrentCart();
    if (currentCart.totals.quantity === updatedCart.totals.quantity) {
      // workaround for product variants issue
      // https://wix.slack.com/archives/C0KGAJJSH/p1669232359513319
      throw new Error('Adding to cart failed due to Product Variant');
    }
  } catch {
    if (!isMobile) {
      await storesApi.product.openQuickView(id);
    } else {
      locationApi.to?.(relativeUrl);
    }
    return;
  }

  if (isMobile) {
    await storesApi.navigate.toCart();
  } else {
    storesApi.cart.showMiniCart();
  }
};
