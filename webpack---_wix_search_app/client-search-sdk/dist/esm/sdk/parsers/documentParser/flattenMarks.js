const openTag = '<mark>';
const closeTag = '</mark>';
export const flattenMarks = (input) => {
    let result = '';
    let i = 0;
    let depth = 0;
    while (i < input.length) {
        if (input[i] === '<' && input.substr(i, openTag.length) === openTag) {
            if (depth === 0) {
                result += openTag;
            }
            depth++;
            i = i + openTag.length;
        } else if (input[i] === '<' &&
            input.substr(i, closeTag.length) === closeTag) {
            if (depth === 1) {
                result += closeTag;
            }
            depth--;
            i = i + closeTag.length;
        } else {
            result += input[i];
            i++;
        }
    }
    return result.replace(/<\/mark> <mark>/g, ' ');
};
//# sourceMappingURL=flattenMarks.js.map