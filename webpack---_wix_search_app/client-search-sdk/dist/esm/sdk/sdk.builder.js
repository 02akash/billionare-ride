import {
    ApiTypes
} from './sdk.types';
export class ClientSearchBuilder {
    constructor() {
        this.searchResponse = {
            documents: [],
            facets: [],
            nextPage: {
                total: 0,
                skip: 0,
                limit: 25,
            },
        };
    }
    withDocuments(count, callback) {
        if (!this.searchResponse) {
            throw new Error('This builder has no search response (e.g. `.withoutResponse()` method was called)');
        }
        if (count === 0) {
            this.searchResponse.documents = [];
            return this;
        }
        this.searchResponse.documents = new Array(count)
            .fill(undefined)
            .map((_value, index) => {
                const itemBuilder = new ClientSearchDocumentBuilder();
                return {
                    ...callback(itemBuilder, index),
                };
            });
        return this;
    }
    withFacets(facets) {
        if (!this.searchResponse) {
            throw new Error('This builder has no search response (e.g. `.withoutResponse()` method was called)');
        }
        this.searchResponse.facets = facets;
        return this;
    }
    withPagination(nextPage) {
        if (!this.searchResponse) {
            throw new Error('This builder has no search response (e.g. `.withoutResponse()` method was called)');
        }
        this.searchResponse.nextPage = nextPage;
        return this;
    }
    withoutResponse() {
        this.searchResponse = undefined;
        return this;
    }
    getSearchResponse() {
        if (!this.searchResponse) {
            throw new Error('This builder has no search response (e.g. `.withoutResponse()` method was called)');
        }
        return this.searchResponse;
    }
}
export class ClientSearchDocumentBuilder {
    constructor() {
        this.document = {
            id: '61312e36-661f-11eb-ae93-0242ac130002',
            title: 'Demo title',
            description: 'Demo long content',
            documentType: ApiTypes.SearchDocumentType.Pages,
            url: '/test-url',
            _highlights: {},
            documentImage: {
                name: 'img.png',
                width: 400,
                height: 400,
            },
        };
    }
    withDocumentType(documentType) {
        this.document.documentType = documentType;
        return this;
    }
    withField(field, value) {
        this.document[field] = value;
        return this;
    }
    withId(id) {
        this.document.id = id;
        return this;
    }
    withTitle(title) {
        this.document.title = title;
        return this;
    }
    withPrice(price) {
        this.document.discountedPrice = price;
        return this;
    }
    withCurrency(currency) {
        this.document.currency = currency;
        return this;
    }
    withInStock(inStock) {
        this.document.inStock = inStock;
        return this;
    }
    withDescription(description) {
        this.document.description = description;
        return this;
    }
    withUrl(url) {
        this.document.url = url;
        return this;
    }
    withImage(image) {
        this.document.documentImage = image;
        return this;
    }
    withHighlights(highlights) {
        this.document._highlights = highlights;
        return this;
    }
    getResponse() {
        return this.document;
    }
}
//# sourceMappingURL=sdk.builder.js.map