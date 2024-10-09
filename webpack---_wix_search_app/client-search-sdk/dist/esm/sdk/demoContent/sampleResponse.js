import {
    SearchDocumentType,
} from '../../api/api.types';
import {
    getDemoSearchResults
} from './searchResults';
import {
    getTotalCount
} from './getTotalCount';
export function getDemoSampleResponse({
    limit,
    query
}, demoDocumentTypes) {
    return {
        results: demoDocumentTypes
            .filter((documentType) => documentType !== SearchDocumentType.All)
            .map((documentType) => {
                const documents = getDemoSearchResults({
                    documentType,
                    skip: 0,
                    limit,
                    query,
                });
                return {
                    documentType,
                    documents,
                    total: getTotalCount(documentType),
                };
            }),
    };
}
//# sourceMappingURL=sampleResponse.js.map