export const query = `query getProductItemsByProductId($productId: String!) {
  catalog {
    product(productId: $productId) {
      productItems {
        id
        optionsSelections 
        price
        formattedPrice
        formattedComparePrice
        availableForPreOrder
        isTrackingInventory
        inventory {
          status
          quantity
        }
        isVisible
        pricePerUnit
        formattedPricePerUnit
        preOrderInfo {
          limit
          message
        }
      }
    }
  }
}
`;
