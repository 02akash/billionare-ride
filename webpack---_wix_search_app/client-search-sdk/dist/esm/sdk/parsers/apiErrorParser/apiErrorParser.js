export function apiErrorParser(errorData) {
    if (!errorData) {
        return;
    }
    const message = errorData.message;
    const apiErrorDetails = {
        code: errorData.details ? .applicationError ? .code,
        description: errorData.details ? .applicationError ? .description,
        message,
        requestId: parseRequestId(message),
    };
    return apiErrorDetails;
}
const requestIdStringSeparator = 'reference:';

function parseRequestId(message) {
    if (typeof message !== 'string') {
        return;
    }
    const messageString = `${message}`;
    if (!messageString.includes(requestIdStringSeparator)) {
        return;
    }
    return (messageString
        .split(requestIdStringSeparator)
        .pop() ?
        .trim() ?
        .replace(')', '') || undefined);
}
//# sourceMappingURL=apiErrorParser.js.map