import {IProduct, IPropsInjectedByViewerScript, ProductItemsState, ProductsManifest} from '../types/galleryTypes';

export class ProductItemsService {
  private readonly updateComponent;

  constructor(updateComponent: (props: Partial<IPropsInjectedByViewerScript>) => void) {
    this.updateComponent = updateComponent;
  }

  public calculateProductItemsState(product: IProduct): ProductItemsState {
    if (product.options?.length === 0 || !product.isManageProductItems) {
      return ProductItemsState.NO_ITEMS;
    }

    return product.options?.length > 0 && product.isManageProductItems && product.productItems?.length > 0
      ? ProductItemsState.AVAILABLE
      : ProductItemsState.MISSING;
  }

  public setProductItemsState(productsManifest: ProductsManifest, productId: string, state: ProductItemsState): void {
    productsManifest[productId].productItemsState = state;
    this.updateComponent({productsManifest});
  }
}
