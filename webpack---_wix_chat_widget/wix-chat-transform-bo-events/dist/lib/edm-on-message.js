"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.wixChat_onMessage = void 0;
var on_message_1 = require("./on-message");

function wixChat_onMessage(event) {
    try {
        return (0, on_message_1.transformServerMessageEventToPublicMessage)(event);
    } catch (ex) {
        return {
            result: "An error occurred: ".concat(ex.toString()),
            rawData: event
        };
    }
}
exports.wixChat_onMessage = wixChat_onMessage;
//# sourceMappingURL=edm-on-message.js.map