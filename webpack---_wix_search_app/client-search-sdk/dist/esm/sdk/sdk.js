import {
    SearchApi,
    VespaSearchApi
} from '../api';
import {
    DocumentParser,
    SuggestionsParser
} from './parsers';
import {
    SearchDocumentType,
} from './sdk.types';
import {
    getDemoSearchResponse,
    getDemoSampleResponse,
} from './demoContent';
import {
    apiErrorParser
} from './parsers/apiErrorParser';
const validDocumentTypes = Object.values(SearchDocumentType);

function getSearchApiDocumentType(documentType) {
    if (documentType === SearchDocumentType.All) {
        return;
    }
    return documentType;
}
const getQuery = (query) => query || '*';
export class ClientSearchSDK {
    constructor({
        httpClient,
        timeout,
        siteBaseUrl,
        language,
        excludeDocumentTypes = [],
        useVespaEndpoints = false,
        useRawProductDocuments = false,
    }) {
        this.useVespaEndpoints = useVespaEndpoints;
        this.language = language;
        this.api = new SearchApi({
            httpClient,
            timeout,
        });
        this.vespaApi = new VespaSearchApi({
            httpClient
        });
        this.excludeDocumentTypes = excludeDocumentTypes;
        this.documentParser = new DocumentParser(siteBaseUrl, language, useRawProductDocuments);
        this.suggestionsParser = new SuggestionsParser(siteBaseUrl, language);
    }
    async search(searchRequest, requestParams) {
        try {
            const request = {
                ...searchRequest,
                documentType: getSearchApiDocumentType(searchRequest.documentType),
                query: getQuery(searchRequest.query),
                language: this.language,
                paging: searchRequest.paging && {
                    skip: (searchRequest.paging.page - 1) * searchRequest.paging.pageSize,
                    limit: searchRequest.paging.pageSize,
                },
            };
            const data = this.demoContentOptions ?
                getDemoSearchResponse(request, this.demoContentOptions) :
                this.useVespaEndpoints &&
                request.documentType === SearchDocumentType.Products ?
                (await this.vespaApi.search(request, requestParams)).data :
                (await this.api.search(request, requestParams)).data;
            const documents = data.documents.map((document) => this.documentParser.parse(document));
            const {
                facets
            } = data;
            const totalResults = data.nextPage ? data.nextPage.total : 0;
            return {
                documents,
                facets,
                totalResults,
            };
        } catch (ex) {
            return {
                errorDetails: apiErrorParser(ex ? .response ? .data),
                isError: true,
            };
        }
    }
    useDemoContent(options) {
        this.demoContentOptions = options;
    }
    parseFederatedResults(results, titleParser) {
        return results
            .filter(({
                    documentType
                }) => validDocumentTypes.includes(documentType) &&
                !this.excludeDocumentTypes.includes(documentType))
            .map((sample) => ({
                ...sample,
                title: titleParser(sample.documentType),
                documents: sample.documents.map((document) => this.documentParser.parse(document)),
            }));
    }
    async getFederatedSuggestions(suggestionsRequest, requestParams) {
        const extendedSuggestionsRequest = {
            ...suggestionsRequest,
            query: getQuery(suggestionsRequest.query),
            limit: suggestionsRequest.limit || 10,
            language: this.language,
        };
        const response = this.useVespaEndpoints ?
            await this.vespaApi.getFederatedSuggestions(extendedSuggestionsRequest, requestParams) :
            await this.api.getFederatedSuggestions(extendedSuggestionsRequest, requestParams);
        const results = this.parseFederatedResults(response.data.results, this.suggestionsParser.getDocumentTypeTitle);
        return {
            results,
        };
    }
    async getTrendingItems(trendingRequest, requestParams) {
        const response = await this.api.getTrendingItems({
            ...trendingRequest,
            language: this.language,
        }, requestParams);
        const results = this.parseFederatedResults(response.data.results, this.suggestionsParser.getDocumentTypeTrendingTitle);
        return {
            results
        };
    }
    async getFederatedAutocomplete(autocompleteRequest, requestParams) {
        const response = await this.api.getFederatedAutocomplete({
            ...autocompleteRequest,
            query: getQuery(autocompleteRequest.query),
            limit: autocompleteRequest.limit || 1,
            language: this.language,
        }, requestParams);
        const results = response.data.results.filter(({
                documentType
            }) => validDocumentTypes.includes(documentType) &&
            !this.excludeDocumentTypes.includes(documentType));
        return {
            results,
        };
    }
    async getSample(sampleRequest, requestParams) {
        try {
            const request = {
                ...sampleRequest,
                query: sampleRequest.query && getQuery(sampleRequest.query),
                language: this.language,
            };
            const shouldUseEmptyResponse = this.demoContentOptions &&
                !this.demoContentOptions.shouldHaveSearchResults;
            let data = shouldUseEmptyResponse ?
                {
                    results: []
                } :
                (await this.api.getSample(request, requestParams)).data;
            if (this.demoContentOptions) {
                const demoDocumentTypes = data.results.map(({
                    documentType
                }) => documentType);
                // NOTE: We make a real request in editor demo mode to get available document types
                // (for tab visibility), but patch actual response documents with demo content.
                data = getDemoSampleResponse(request, demoDocumentTypes);
            }
            const documentsMapper = (document) => this.documentParser.parse(document);
            const results = data.results
                .filter(({
                        documentType
                    }) => validDocumentTypes.includes(documentType) &&
                    !this.excludeDocumentTypes.includes(documentType))
                .map((sample) => ({
                    ...sample,
                    documents: sample.documents.map(documentsMapper),
                }));
            return {
                results,
            };
        } catch (ex) {
            return {
                errorDetails: apiErrorParser(ex ? .response ? .data),
                isError: true,
            };
        }
    }
}
//# sourceMappingURL=sdk.js.map