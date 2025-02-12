"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.transformServerMessageEventToPublicMessage = void 0;
var transform_message_1 = require("./transform-message");
var public_types_1 = require("./types/public-types");

function transformServerMessageEventToPublicMessage(event) {
    try {
        var direction = event.isEcho ? public_types_1.MessageDirectionServer.BusinessToCustomer : public_types_1.MessageDirectionServer.CustomerToBusiness;
        var message = event.message.event.message; //don't ask...
        return (0, transform_message_1.transformMessage)(message, direction);
    } catch (ex) {
        console.error("error transforming kafka message to public message ".concat(ex.toString()));
        throw ex;
    }
}
exports.transformServerMessageEventToPublicMessage = transformServerMessageEventToPublicMessage;
//# sourceMappingURL=on-message.js.map