import {
    SearchDocumentType
} from '../sdk';
const MAX_SUGGEST_QUERY_LENGTH = 100;
const CORRELATION_ID_HEADER_NAME = 'x-wix-search-bi-correlation-id';
const BASE_API_URL = '/_api/search-services-sitesearch';
export const API_URL_SEARCH = `${BASE_API_URL}/v1/search`;
export const API_URL_SUGGEST_FEDERATED = `${BASE_API_URL}/v1/suggest/federated`;
export const API_URL_TRENDING = `${BASE_API_URL}/v1/trending`;
export const API_URL_SEARCH_FEDERATED = `${BASE_API_URL}/v1/search/federated`;
export const API_URL_AUTOCOMPLETE_FEDERATED = `${BASE_API_URL}/v1/autocomplete/federated`;
export class SearchApi {
    constructor({
        httpClient,
        timeout
    }) {
        this.httpClient = httpClient;
        this.requestOptions = {
            timeout
        };
    }
    getFieldsByDocumentType(searchRequest) {
        if (!searchRequest.documentType) {
            return;
        }
        const fieldsByDocumentType = {
            [SearchDocumentType.Products]: [
                'currency',
                'discountedPrice',
                'inStock',
            ],
            [SearchDocumentType.Events]: [
                'currency',
                'eventType',
                'location',
                'maxPrice',
                'minPrice',
                'startDate',
            ],
            [SearchDocumentType.Forums]: [
                'contentType',
                'categoryTitle',
                'createdDate',
                'totalComments',
                'viewCount',
                'likeCount',
                'upvoteCount',
                'downvoteCount',
                'parentId',
                'images',
                'marked',
                'markedComments',
                'score',
                'commentInteraction',
            ],
            [SearchDocumentType.ProGallery]: [
                'focalPointY',
                'focalPointX',
                'isVideo',
            ],
        };
        const extraFields = fieldsByDocumentType[searchRequest.documentType] || [];
        return ['description', 'title', 'id'].concat(extraFields);
    }
    getHeaders(params) {
        return params ? .correlationId ?
            {
                [CORRELATION_ID_HEADER_NAME]: params.correlationId
            } :
            {};
    }
    search(searchRequest, requestParams) {
        const data = {
            ...searchRequest,
            fuzzy: true,
            fields: this.getFieldsByDocumentType(searchRequest),
        };
        return this.httpClient.post(API_URL_SEARCH, data, {
            ...this.requestOptions,
            headers: this.getHeaders(requestParams),
        });
    }
    getFederatedSuggestions(suggestionsRequest, requestParams) {
        const data = {
            ...suggestionsRequest,
            query: suggestionsRequest.query.substring(0, MAX_SUGGEST_QUERY_LENGTH),
        };
        return this.httpClient.post(API_URL_SUGGEST_FEDERATED, data, {
            ...this.requestOptions,
            headers: this.getHeaders(requestParams),
        });
    }
    getTrendingItems(trendingRequest, requestParams) {
        return this.httpClient.post(API_URL_TRENDING, trendingRequest, { ...this.requestOptions,
            headers: this.getHeaders(requestParams)
        });
    }
    getFederatedAutocomplete(autocompleteRequest, requestParams) {
        return this.httpClient.post(API_URL_AUTOCOMPLETE_FEDERATED, autocompleteRequest, {
            ...this.requestOptions,
            headers: this.getHeaders(requestParams),
        });
    }
    getSample(sampleRequest, requestParams) {
        const data = {
            ...sampleRequest,
            fuzzy: true,
        };
        return this.httpClient.post(API_URL_SEARCH_FEDERATED, data, {
            ...this.requestOptions,
            headers: this.getHeaders(requestParams),
        });
    }
}
//# sourceMappingURL=api.js.map