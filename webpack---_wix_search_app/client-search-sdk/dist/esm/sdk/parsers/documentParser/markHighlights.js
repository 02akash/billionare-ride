import {
    flattenMarks
} from './flattenMarks';
export const markHighlights = (input, highlights) => {
    if (!highlights) {
        return input;
    }
    const withMarks = highlights.join().match(/<mark>(.*?)<\/mark>/g) || [];
    const withoutMarks = withMarks.map((match) => match.replace(/<[^>]*>/gi, ''));
    let result = input;
    withoutMarks.forEach((highlight) => {
        // matches ${highlight} which is not followed by `</mark>` and `>`
        // we need `>` part in cases we want to properly replace word `mark`
        const regexp = new RegExp(`(${highlight})(?!</mark>|>)`);
        result = result.replace(regexp, `<mark>${highlight}</mark>`);
    });
    return flattenMarks(result);
};
//# sourceMappingURL=markHighlights.js.map