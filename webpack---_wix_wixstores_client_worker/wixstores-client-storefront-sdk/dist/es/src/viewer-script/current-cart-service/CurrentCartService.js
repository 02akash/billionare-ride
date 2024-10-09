import {
    __assign,
    __awaiter,
    __generator
} from "tslib";
import {
    CartActions
} from '../../actions/CartActions/CartActions';
import {
    APP_DEFINITION_ID
} from '@wix/wixstores-client-core';
import {
    DEFAULT_CART_OPTIONS
} from '../../constants';
var CACHE_KEY = 'CURRENT_CART';
var origin = 'current-cart-service';
var CurrentCartService = /** @class */ (function() {
    function CurrentCartService(_a) {
        var context = _a.context,
            apis = _a.apis;
        this.apis = apis;
        this.cartActions = new CartActions({
            siteStore: context.siteStore,
            origin: origin,
            originatedInWorker: true
        });
        this.siteStore = context.siteStore;
    }
    CurrentCartService.prototype.init = function() {
        this.cartPromise = this.getCurrentCartFromServerOrCache();
        this.listenToCurrentCartEvents();
    };
    CurrentCartService.prototype.refresh = function() {
        this.cartPromise = this.getCurrentCartFromServerAndSaveToCache();
        this.publishCurrentCartUpdated();
    };
    CurrentCartService.prototype.getCurrentCart = function(options) {
        if (options === void 0) {
            options = DEFAULT_CART_OPTIONS;
        }
        var withShipping = options.withShipping,
            withTax = options.withTax,
            shouldSyncWithCurrentCart = options.shouldSyncWithCurrentCart;
        if (withShipping !== DEFAULT_CART_OPTIONS.withShipping || withTax !== DEFAULT_CART_OPTIONS.withTax) {
            if (shouldSyncWithCurrentCart) {
                this.refresh();
            }
            return this.cartActions.getCurrentCart({
                withShipping: withShipping,
                withTax: withTax,
                locale: this.siteStore.storeLanguage
            });
        }
        if (!this.cartPromise) {
            this.cartPromise = this.getCurrentCartFromServerOrCache();
        }
        return this.cartPromise;
    };
    CurrentCartService.prototype.setCurrentCartPromiseAndPublishUpdatedEvent = function(cartPromise) {
        this.cartPromise = cartPromise;
        this.publishCurrentCartUpdated();
    };
    CurrentCartService.prototype.listenToCurrentCartEvents = function() {
        var _this = this;
        var currency = this.siteStore.location.query.currency;
        this.siteStore.location.onChange(function() {
            if (currency !== _this.siteStore.location.query.currency) {
                currency = _this.siteStore.location.query.currency;
                _this.refresh();
            }
        });
        this.siteStore.pubSubManager.subscribe('Cart.Cleared', function(res) {
            _this.getCurrentCart().then(function(_a) {
                var cartId = _a.cartId;
                if (res.data.cartId === cartId) {
                    _this.setCurrentCartPromiseAndPublishUpdatedEvent(Promise.resolve({
                        items: []
                    }));
                    _this.invalidateCurrentCartCache();
                }
            });
        });
        this.siteStore.pubSubManager.subscribe('Cart.Changed', function(res) {
            _this.getCurrentCart().then(function(_a) {
                var cartId = _a.cartId;
                return __awaiter(_this, void 0, void 0, function() {
                    var cartPromise, cart;
                    var _b;
                    return __generator(this, function(_c) {
                        switch (_c.label) {
                            case 0:
                                cartPromise = ((_b = res.data.eventOptions) === null || _b === void 0 ? void 0 : _b.originatedInWorker) && cartId ?
                                    Promise.resolve(res.data) :
                                    this.getCurrentCartFromServerAndSaveToCache();
                                this.setCurrentCartPromiseAndPublishUpdatedEvent(cartPromise);
                                return [4 /*yield*/ , cartPromise];
                            case 1:
                                cart = _c.sent();
                                this.saveCartToCache(cart);
                                return [2 /*return*/ ];
                        }
                    });
                });
            });
        });
        this.siteStore.pubSubManager.subscribe('Cart.Invalidated', function() {
            _this.invalidateCurrentCartCache();
        });
        this.siteStore.siteApis.onInstanceChanged(function() {
            return _this.refresh();
        }, APP_DEFINITION_ID);
    };
    CurrentCartService.prototype.invalidateCurrentCartCache = function() {
        this.apis.storage.memory.removeItem(CACHE_KEY);
    };
    CurrentCartService.prototype.publishCurrentCartUpdated = function() {
        this.siteStore.pubSubManager.publish('CurrentCart.Updated', {});
    };
    CurrentCartService.prototype.getCurrentCartFromServerOrCache = function() {
        return __awaiter(this, void 0, void 0, function() {
            var cachedCart;
            return __generator(this, function(_a) {
                cachedCart = this.apis.storage.memory.getItem(CACHE_KEY);
                if (cachedCart) {
                    return [2 /*return*/ , JSON.parse(cachedCart)];
                }
                return [2 /*return*/ , this.getCurrentCartFromServerAndSaveToCache()];
            });
        });
    };
    CurrentCartService.prototype.getCurrentCartFromServerAndSaveToCache = function() {
        return __awaiter(this, void 0, void 0, function() {
            var cart;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.cartActions.getCurrentCart(__assign(__assign({}, DEFAULT_CART_OPTIONS), {
                            locale: this.siteStore.storeLanguage
                        }))];
                    case 1:
                        cart = _a.sent();
                        this.saveCartToCache(cart);
                        return [2 /*return*/ , cart];
                }
            });
        });
    };
    CurrentCartService.prototype.saveCartToCache = function(cart) {
        this.apis.storage.memory.setItem(CACHE_KEY, JSON.stringify(cart));
    };
    return CurrentCartService;
}());
export {
    CurrentCartService
};
//# sourceMappingURL=CurrentCartService.js.map