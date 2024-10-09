import {
    getFieldsByDocumentType
} from './getFieldsByDocumentType';
const MAX_SUGGEST_QUERY_LENGTH = 100;
const CORRELATION_ID_HEADER_NAME = 'x-wix-search-bi-correlation-id';
const BASE_API_URL = '/_api/vsite-feeder-service';
export const API_URL_VESPA_SEARCH = `${BASE_API_URL}/v1/search`;
export const API_URL_VESPA_SUGGEST = `${BASE_API_URL}/v1/suggest/federated`;
export class VespaSearchApi {
    constructor({
        httpClient
    }) {
        this.httpClient = httpClient;
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
            fields: getFieldsByDocumentType(searchRequest.documentType),
        };
        return this.httpClient.post(API_URL_VESPA_SEARCH, data, {
            headers: this.getHeaders(requestParams),
        });
    }
    getFederatedSuggestions(suggestionsRequest, requestParams) {
        const data = {
            ...suggestionsRequest,
            query: suggestionsRequest.query.substring(0, MAX_SUGGEST_QUERY_LENGTH),
        };
        return this.httpClient.post(API_URL_VESPA_SUGGEST, data, {
            headers: this.getHeaders(requestParams),
        });
    }
}
//# sourceMappingURL=vespaApi.js.map