/**
 * @deprecated
 */
var createVolatileCartMutation = "mutation createCart(\n  $productId: String!\n  $optionSelectionId: [Int]!\n  $quantity: Int!\n  $customTextFieldSelection: [CustomTextOptionInput]!\n  $subscriptionOptionId: String\n  $buyerNote: String\n  $variantId: String\n  $isPickupOnly: Boolean\n  $options: Json\n  $preOrderRequested: Boolean\n) {\n  checkout {\n    createCart(\n      productId: $productId\n      optionSelectionId: $optionSelectionId\n      customTextFieldSelection: $customTextFieldSelection\n      quantity: $quantity\n      subscriptionOptionId: $subscriptionOptionId\n      buyerNote: $buyerNote\n      variantId: $variantId\n      isPickupOnly: $isPickupOnly\n      options: $options\n      preOrderRequested: $preOrderRequested\n    ) {\n      id\n      checkoutId\n      lineItems {\n        id\n      }\n    }\n  }\n}";
/**
 * @deprecated
 */
var getCashierCheckoutDataQuery = "query getCashierCheckoutData {\n  checkoutSettings {\n    termsAndConditions {\n       value,\n      enabled\n    }\n    checkoutCustomField {\n      mandatory\n      show\n    }\n  },\n  localeData(language:\"en\") {\n    countries {\n      key,\n      shortKey\n    }\n  }\n}";
/**
 * @deprecated
 */
var getCheckoutQuery = "query getCheckout($checkoutId: String!) {\n  checkout(checkoutId: $checkoutId) {\n    id\n    appliedDiscounts {\n      coupon {\n        id\n        code\n        couponType\n        name\n        amount {\n          amount\n          convertedAmount\n          formattedAmount\n          formattedConvertedAmount\n        }\n      }\n      discountType\n      lineItemIds\n    }\n    billingInfo {\n      address {\n        addressLine\n        addressLine2\n        city\n        country\n        countryFullname\n        postalCode\n        subdivision\n        subdivisionFullname\n        streetAddress {\n          apt\n          name\n          number\n        }\n      }\n      addressesServiceId\n      contactDetails {\n        firstName\n        lastName\n        phone\n        company\n        vatId {\n          id\n          type\n        }\n      }\n    }\n    buyerInfo {\n      contactId\n      email\n      visitorId\n    }\n    buyerLanguage\n    buyerNote\n    channelType\n    customFields {\n      title\n      translatedTitle\n      value\n    }\n    completed\n    conversionCurrency\n    currency\n    siteLanguage\n    weightUnit\n    taxIncludedInPrice\n    giftCard {\n      id\n      amount {\n        amount\n        convertedAmount\n        formattedAmount\n        formattedConvertedAmount\n      }\n      appId\n      obfuscatedCode\n    }\n    priceSummary {\n      discount {\n        amount\n        convertedAmount\n        formattedAmount\n        formattedConvertedAmount\n      }\n      shipping {\n        amount\n        convertedAmount\n        formattedAmount\n        formattedConvertedAmount\n      }\n      subtotal {\n        amount\n        convertedAmount\n        formattedAmount\n        formattedConvertedAmount\n      }\n      tax {\n        amount\n        convertedAmount\n        formattedAmount\n        formattedConvertedAmount\n      }\n      total {\n        amount\n        convertedAmount\n        formattedAmount\n        formattedConvertedAmount\n      }\n    }\n    taxSummary {\n      manualTaxRate\n      taxableAmount {\n        amount\n        convertedAmount\n        formattedAmount\n        formattedConvertedAmount\n      }\n      totalTax {\n        amount\n        convertedAmount\n        formattedAmount\n        formattedConvertedAmount\n      }\n      calculationDetails {\n        manualRateReason\n        rateType\n      }\n    }\n    lineItems {\n      id\n      fulfillerId\n      availability {\n        quantityAvailable\n        status\n      }\n      catalogReference {\n        appId\n        catalogItemId\n        options\n      }\n      couponScopes {\n        group {\n          entityId\n          name\n        }\n        namespace\n      }\n      discount {\n        amount\n        convertedAmount\n        formattedAmount\n        formattedConvertedAmount\n      }\n      fullPrice {\n        amount\n        convertedAmount\n        formattedAmount\n        formattedConvertedAmount\n      }\n      price {\n        amount\n        convertedAmount\n        formattedAmount\n        formattedConvertedAmount\n      }\n      totalPriceAfterTax {\n        amount\n        convertedAmount\n        formattedAmount\n        formattedConvertedAmount\n      }\n      totalPriceBeforeTax {\n        amount\n        convertedAmount\n        formattedAmount\n        formattedConvertedAmount\n      }\n      quantity\n      shippingGroupId\n      url {\n        relativePath\n        url\n      }\n      itemType {\n        preset\n      }\n      media {\n        altText\n        height\n        id\n        url\n        width\n      }\n      productName {\n        original\n        translated\n      }\n      physicalProperties {\n        shippable\n        sku\n        weight\n      }\n      descriptionLines {\n        name {\n          original\n          translated\n        }\n        plainText{\n          original\n          translated\n        }\n      }\n      taxDetails {\n        rateBreakdown {\n          name\n          rate\n          tax {\n            amount\n            convertedAmount\n            formattedAmount\n            formattedConvertedAmount\n          }\n        }\n        taxGroupId\n        taxRate\n        taxableAmount {\n          amount\n          convertedAmount\n          formattedAmount\n          formattedConvertedAmount\n        }\n        totalTax {\n          amount\n          convertedAmount\n          formattedAmount\n          formattedConvertedAmount\n        }\n      }\n      subscriptionOptionInfo {\n        description {\n          original\n          translated\n        }\n        title {\n          original\n          translated\n        }\n        subscriptionSettings {\n          autoRenewal\n          billingCycles\n          frequency\n          interval\n        }\n      }\n    }\n    shippingInfo {\n      shippingDestination {\n        address {\n          addressLine\n          addressLine2\n          city\n          country\n          countryFullname\n          postalCode\n          subdivision\n          subdivisionFullname\n          streetAddress {\n            apt\n            name\n            number\n          }\n        }\n        addressesServiceId\n        contactDetails {\n          firstName\n          lastName\n          phone\n          company\n          vatId {\n            id\n            type\n          }\n        }\n      }\n      region {\n        id\n        name\n      }\n      selectedCarrierServiceOption {\n        carrierId\n        code\n        cost {\n          price {\n            amount\n            convertedAmount\n            formattedAmount\n            formattedConvertedAmount\n          }\n          totalDiscount {\n            amount\n            convertedAmount\n            formattedAmount\n            formattedConvertedAmount\n          }\n          totalPriceAfterTax {\n            amount\n            convertedAmount\n            formattedAmount\n            formattedConvertedAmount\n          }\n          totalPriceBeforeTax {\n            amount\n            convertedAmount\n            formattedAmount\n            formattedConvertedAmount\n          }\n          taxDetails {\n            rateBreakdown {\n              name\n              rate\n              tax {\n                amount\n                convertedAmount\n                formattedAmount\n                formattedConvertedAmount\n              }\n            }\n            taxGroupId\n            taxRate\n            taxableAmount {\n              amount\n              convertedAmount\n              formattedAmount\n              formattedConvertedAmount\n            }\n            totalTax {\n              amount\n              convertedAmount\n              formattedAmount\n              formattedConvertedAmount\n            }\n          }\n        }\n        logistics {\n          deliveryTime\n          instructions\n          pickupDetails {\n            address {\n              addressLine\n              addressLine2\n              city\n              country\n              countryFullname\n              postalCode\n              subdivision\n              subdivisionFullname\n              streetAddress {\n                apt\n                name\n                number\n              }\n            }\n            businessLocation\n          }\n        }\n        otherCharges {\n          cost {\n            price {\n              amount\n              convertedAmount\n              formattedAmount\n              formattedConvertedAmount\n            }\n            totalDiscount {\n              amount\n              convertedAmount\n              formattedAmount\n              formattedConvertedAmount\n            }\n            totalPriceAfterTax {\n              amount\n              convertedAmount\n              formattedAmount\n              formattedConvertedAmount\n            }\n            totalPriceBeforeTax {\n              amount\n              convertedAmount\n              formattedAmount\n              formattedConvertedAmount\n            }\n            taxDetails {\n              rateBreakdown {\n                name\n                rate\n                tax {\n                  amount\n                  convertedAmount\n                  formattedAmount\n                  formattedConvertedAmount\n                }\n              }\n              taxGroupId\n              taxRate\n              taxableAmount {\n                amount\n                convertedAmount\n                formattedAmount\n                formattedConvertedAmount\n              }\n              totalTax {\n                amount\n                convertedAmount\n                formattedAmount\n                formattedConvertedAmount\n              }\n            }\n          }\n          details\n          type\n        }\n        requestedShippingOption\n        title\n      }\n      carrierServiceOptions {\n        carrierId\n        shippingOptions {\n          code\n          title\n          logistics {\n            deliveryTime\n            instructions\n            pickupDetails {\n              address {\n                addressLine\n                addressLine2\n                city\n                country\n                countryFullname\n                postalCode\n                subdivision\n                subdivisionFullname\n                streetAddress {\n                  apt\n                  name\n                  number\n                }\n              }\n              businessLocation\n            }\n          }\n          cost {\n            price {\n              amount\n              convertedAmount\n              formattedAmount\n              formattedConvertedAmount\n            }\n            otherCharges {\n              price {\n                amount\n                convertedAmount\n                formattedAmount\n                formattedConvertedAmount\n              }\n              type\n            }\n          }\n        }\n      }\n    }\n  }\n}\n";
/**
 * @deprecated
 */
var setAddressMutation = "mutation setAddress(\n  $cartId: String!\n  $shippingAddress: CheckoutAddressInput!\n  $billingAddress: CheckoutAddressInput!\n  $checkoutId: String\n) {\n  checkout {\n    setAddress(\n      cartId: $cartId\n      shippingAddress: $shippingAddress\n      billingAddress: $billingAddress\n      checkoutId: $checkoutId\n    ) {\n      cartService {\n        cart {\n          checkoutId\n          cartId\n        }\n      }\n    }\n  }\n}\n";
/**
 * @deprecated
 */
var setCartAddressesAndDestinationFromSingleAddressMutation = "mutation setCartAddressesAndDestinationFromSingleAddress(\n  $cartId: String!\n  $address: CheckoutAddressInput!\n  $checkoutId: String\n) {\n  checkout {\n    setCartAddressesAndDestinationFromSingleAddress(\n      cartId: $cartId\n      address: $address\n      checkoutId: $checkoutId\n    ) {\n      cartService {\n        cart {\n          checkoutId\n          cartId\n        }\n      }\n    }\n  }\n}\n";
/**
 * @deprecated
 */
var setCartBillingAddressMutation = "mutation setCartBillingAddress(\n    $cartId: String\n    $address: CheckoutAddressInput!\n    $checkoutId: String\n  ) {\n    checkout {\n      setCartBillingAddress(cartId: $cartId, address: $address, checkoutId: $checkoutId) {\n        cartService {\n          cart {\n            checkoutId\n            cartId\n          }\n        }\n      }\n    }\n  }\n  ";
/**
 * @deprecated
 */
var setCartShippingAddressAndDestinationMutation = "mutation setCartShippingAddressAndDestination(\n    $cartId: String\n    $address: CheckoutAddressInput!\n    $checkoutId: String\n  ) {\n    checkout {\n      setCartShippingAddressAndDestination(\n        cartId: $cartId\n        address: $address\n        checkoutId: $checkoutId\n      ) {\n        cartService {\n          cart {\n            checkoutId\n            cartId\n          }\n        }\n      }\n    }\n  }\n  ";
/**
 * @deprecated
 */
var setCartShippingAddressesForFastFlowEstimationMutation = "mutation setCartShippingAddressesForFastFlowEstimation(\n  $cartId: String\n  $address: CheckoutFastFlowEstimationAddressInput!\n  $checkoutId: String\n) {\n  checkout {\n    setCartShippingAddressesForFastFlowEstimation(cartId: $cartId, address: $address, checkoutId: $checkoutId) {\n      cartService {\n        cart {\n          checkoutId\n          cartId\n          destinationCompleteness\n          totals {\n            itemsTotal\n            subTotal\n            shipping\n            tax\n            payNow\n            payLater\n            additionalFeesTotal\n            total\n            discount\n            shippingWithoutTax\n            giftCardAmount\n            formattedSubTotal\n            formattedShipping\n            formattedTax\n            formattedPayNow\n            formattedPayLater\n            formattedAdditionalFeesTotal\n            formattedTotal\n            formattedDiscount\n            formattedShippingWithoutTax\n            formattedGiftCardAmount\n          }\n          selectedShippingOption {\n            id\n          }\n          shippingRuleInfo {\n            status\n            canShipToDestination\n            shippingRule {\n              id\n              ruleType\n              options {\n                id\n                title\n                rate\n                formattedRate\n                deliveryTime\n                carrierId\n                pickupInfo {\n                  address {\n                    country\n                    countryName(translateTo: \"en\")\n                    subdivision\n                    subdivisionName(translateTo: \"en\")\n                    addressLine\n                    city\n                    zipCode\n                  }\n                  instructions\n                  pickupMethod\n                }\n                deliveryTimeSlot {\n                  from\n                  to\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n";
/**
 * @deprecated
 */
var setShippingOptionMutation = "mutation setShippingOption(\n    $cartId: String!\n    $checkoutId: String\n    $selectedShippingOption: SelectedShippingOption!\n  ) {\n    checkout {\n      setShippingOption(\n        cartId: $cartId\n        checkoutId: $checkoutId\n        selectedShippingOption: $selectedShippingOption\n      ) {\n        errors {\n          code\n          commandName\n          message\n          field\n        }\n        cartService {\n          cart {\n            checkoutId\n            cartId\n          }\n        }\n      }\n    }\n  }\n  ";
/**
 * @deprecated
 */
var submitPaymentMutation = "mutation submitPayment(\n    $cartId: String\n    $checkoutId: String\n    $paymentId: String\n    $shouldRedirect: Boolean!\n    $isPickupFlow: Boolean!\n    $forceLocale: String!\n    $deviceType: String!\n    $inUserDomain: Boolean!\n  ) {\n    checkout {\n      submitPayment(\n        cartId: $cartId\n        checkoutId: $checkoutId\n        paymentId: $paymentId\n        shouldRedirect: $shouldRedirect\n        isPickupFlow: $isPickupFlow\n        forceLocale: $forceLocale\n        deviceType: $deviceType\n        inUserDomain: $inUserDomain\n      ) {\n        redirectUrls {\n          successUrl\n          cancelUrl\n          errorUrl\n          pendingUrl\n        }\n        orderId\n        paymentResponse {\n          chargeId\n          transactionStatus\n          redirectUrl\n          failureDetails\n          responseToken\n        }\n        cartStatus {\n          success\n          error\n        }\n      }\n    }\n  }\n  ";
/**
 * @deprecated
 */
export var queries = {
    createVolatileCartMutation: createVolatileCartMutation,
    getCashierCheckoutDataQuery: getCashierCheckoutDataQuery,
    getCheckoutQuery: getCheckoutQuery,
    setAddressMutation: setAddressMutation,
    setCartAddressesAndDestinationFromSingleAddressMutation: setCartAddressesAndDestinationFromSingleAddressMutation,
    setCartBillingAddressMutation: setCartBillingAddressMutation,
    setCartShippingAddressAndDestinationMutation: setCartShippingAddressAndDestinationMutation,
    setCartShippingAddressesForFastFlowEstimationMutation: setCartShippingAddressesForFastFlowEstimationMutation,
    setShippingOptionMutation: setShippingOptionMutation,
    submitPaymentMutation: submitPaymentMutation,
};
//# sourceMappingURL=deprecated.graphql.js.map