import {
    __awaiter,
    __generator
} from "tslib";
import {
    CartEvents
} from '@wix/wixstores-client-core';
import {
    CartActions
} from '../../../actions/CartActions/CartActions';
import {
    MinicartActions
} from '../../../actions/MiniCartActions/MinicartActions';
import {
    CartApi
} from '../../../apis/CartApi/CartApi';
import {
    TinyCartActions
} from '../../../actions/TinyCartActions/TinyCartActions';
import {
    SideCartActions
} from '../../../actions/SideCartActions/SideCartActions';
export function createCartExports(_a) {
    var _this = this;
    var context = _a.context,
        origin = _a.origin;
    var getCartActions = function(_a) {
        var siteStore = _a.siteStore;
        return new CartActions({
            siteStore: siteStore,
            origin: origin,
            originatedInWorker: true
        });
    };
    var getCurrentCartByContext = function(_a) {
        var siteStore = _a.siteStore;
        return new CartApi({
            siteStore: siteStore,
            origin: origin
        }).fetchCart();
    };
    var getMiniCartActions = function(siteStore) {
        return new MinicartActions({
            siteStore: siteStore,
            origin: origin
        });
    };
    var getSideCartActions = function(siteStore) {
        return new SideCartActions({
            siteStore: siteStore,
            origin: origin
        });
    };
    var getTinyCartActions = function(siteStore) {
        return new TinyCartActions({
            siteStore: siteStore,
            origin: origin
        });
    };
    var hideMiniCart = function() {
        if (context.siteStore.isMobile()) {
            throw Error("can't handle mini cart in mobile");
        }
        getMiniCartActions(context.siteStore).hideMinicart();
    };
    return {
        getCurrentCart: function() {
            return getCartActions(context).getCurrentCart();
        },
        onChange: function(listener) {
            context.siteStore.pubSubManager.subscribe(CartEvents.CHANGED, listener);
        },
        removeProduct: function(cartItemId, options) {
            if (options === void 0) {
                options = {
                    silent: false
                };
            }
            return __awaiter(_this, void 0, void 0, function() {
                return __generator(this, function(_a) {
                    return [2 /*return*/ , getCurrentCartByContext(context).then(function(_a) {
                        var cartId = _a.cartId;
                        //@ts-expect-error
                        return getCartActions(context).removeItemFromCart({
                            cartId: cartId,
                            cartItemId: Number(cartItemId)
                        }, options);
                    })];
                });
            });
        },
        addCustomItems: function(customItems) {
            return __awaiter(_this, void 0, void 0, function() {
                return __generator(this, function(_a) {
                    return [2 /*return*/ , getCartActions(context).addCustomItemsToCart(customItems)];
                });
            });
        },
        addProducts: function(items, options) {
            if (options === void 0) {
                options = {
                    silent: false
                };
            }
            return __awaiter(_this, void 0, void 0, function() {
                return __generator(this, function(_a) {
                    return [2 /*return*/ , getCartActions(context).addProductsToCart(items, options)];
                });
            });
        },
        addToCart: function(productId, quantity, options, preOrderRequested, trackData) {
            if (options === void 0) {
                options = {};
            }
            if (preOrderRequested === void 0) {
                preOrderRequested = undefined;
            }
            return __awaiter(_this, void 0, void 0, function() {
                return __generator(this, function(_a) {
                    switch (_a.label) {
                        case 0:
                            return [4 /*yield*/ , getCartActions(context).addToCart({
                                productId: "".concat(productId),
                                quantity: parseInt("".concat(quantity), 10),
                                optionsSelectionsByNames: options.choices,
                                customTextFieldSelections: options.customTextFields,
                                optionsSelectionsIds: options.optionsSelectionsIds,
                                variantId: options.variantId,
                                subscriptionOptionId: options.subscriptionOptionId,
                                addToCartAction: options.addToCartAction,
                                preOrderRequested: preOrderRequested,
                            }, trackData)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/ ];
                    }
                });
            });
        },
        applyCoupon: function(couponCode) {
            return getCurrentCartByContext(context).then(function(_a) {
                var cartId = _a.cartId;
                //@ts-expect-error
                return getCartActions(context).applyCouponToCart({
                    cartId: cartId,
                    couponCode: couponCode
                });
            });
        },
        removeCoupon: function() {
            return __awaiter(_this, void 0, void 0, function() {
                return __generator(this, function(_a) {
                    return [2 /*return*/ , getCurrentCartByContext(context).then(function(_a) {
                        var cartId = _a.cartId,
                            appliedCoupon = _a.appliedCoupon;
                        return getCartActions(context).removeCouponFromCart({
                            //@ts-expect-error
                            cartId: cartId,
                            //@ts-expect-error
                            couponCode: appliedCoupon.code,
                            //@ts-expect-error
                            couponId: appliedCoupon.couponId,
                        });
                    })];
                });
            });
        },
        updateLineItemQuantity: function(cartItemId, quantity, options) {
            if (options === void 0) {
                options = {
                    silent: false
                };
            }
            return getCurrentCartByContext(context).then(function(_a) {
                var cartId = _a.cartId;
                //@ts-expect-error
                return getCartActions(context).updateLineItemQuantityInCart({
                    cartId: cartId,
                    cartItemId: cartItemId,
                    quantity: quantity
                }, options);
            });
        },
        showMinicart: function() {
            return getSideCartActions(context.siteStore).showMiniCartOrSideCart();
        },
        hideMinicart: hideMiniCart,
        openSideCart: function() {
            return getSideCartActions(context.siteStore).showMiniCartOrSideCart();
        },
        showTinycart: function() {
            if (context.siteStore.isMobile()) {
                throw Error("can't open success popup in mobile");
            }
            getTinyCartActions(context.siteStore).showTinyCart();
        },
        hideTinycart: function() {
            if (context.siteStore.isMobile()) {
                throw Error("can't open success popup in mobile");
            }
            getTinyCartActions(context.siteStore).hideTinyCart();
        },
        reloadCart: function() {
            context.siteStore.pubSubManager.publish(CartEvents.INVALIDATED, {});
            return getCartActions(context).reloadCart();
        },
        hasSideCart: function() {
            return getSideCartActions(context.siteStore).hasSideCart();
        },
    };
}
//# sourceMappingURL=wixcode.cart.js.map