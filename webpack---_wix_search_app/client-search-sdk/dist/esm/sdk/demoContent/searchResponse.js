import {
    SearchDocumentType,
} from '../../api/api.types';
import {
    getDemoSearchResults
} from './searchResults';
import {
    getTotalCount
} from './getTotalCount';
const PAGE_SIZE = 10;
const SEARCH_RESULTS_EMPTY_RESPONSE = {
    documents: [],
    nextPage: {
        total: 0,
        skip: 0,
        limit: PAGE_SIZE
    },
    facets: [],
};
export function getDemoSearchResponse(searchRequest, {
    shouldHaveSearchResults
}) {
    if (!shouldHaveSearchResults) {
        return SEARCH_RESULTS_EMPTY_RESPONSE;
    }
    const documentType = searchRequest.documentType || SearchDocumentType.All;
    const totalCount = getTotalCount(documentType);
    const skip = (searchRequest.paging && searchRequest.paging.skip) || 0;
    const limit = Math.min(totalCount - skip, (searchRequest.paging && searchRequest.paging.limit) || PAGE_SIZE);
    return {
        documents: getDemoSearchResults({
            documentType,
            limit,
            skip,
            query: searchRequest.query,
        }),
        nextPage: {
            total: totalCount,
            skip: 0,
            limit
        },
        facets: [],
    };
}
//# sourceMappingURL=searchResponse.js.map