import {
    ApiTypes,
} from '../../sdk.types';
import {
    DOCUMENT_IMAGE_PLACEHOLDER,
    PRODUCT_IMAGE_PLACEHOLDER,
} from './DocumentParser.constants';
import {
    flattenMarks
} from './flattenMarks';
import {
    markHighlights
} from './markHighlights';
const concatHighlights = (input, highlights) => (highlights ? flattenMarks(highlights ? .join(' ')) : input);
export class DocumentParser {
    constructor(siteBaseUrl, language = 'en', useRawProductDocuments = false) {
        this.siteBaseUrl = siteBaseUrl;
        this.language = language;
        this.useRawProductDocuments = useRawProductDocuments;
    }
    parseDefaultDocument(rawDocument) {
        return {
            description: concatHighlights(rawDocument.description ? ? '', rawDocument._highlights ? .description),
            image: this.parseImage(rawDocument),
            relativeUrl: this.getRelativeUrl(rawDocument.url),
            title: markHighlights(rawDocument.title, rawDocument._highlights ? .title),
            url: this.parseUrl(rawDocument),
            id: rawDocument.id,
            documentType: rawDocument.documentType,
        };
    }
    parseImage(document, emptyImage = DOCUMENT_IMAGE_PLACEHOLDER) {
        return document.documentImage ? document.documentImage : emptyImage;
    }
    parseProductImage(document) {
        return this.parseImage(document, PRODUCT_IMAGE_PLACEHOLDER);
    }
    parseForumImages(images) {
        const image = images[0];
        const hasImage = !!image ? .url;
        return hasImage ?
            {
                width: image.width,
                height: image.height,
                name: image.url
            } :
            undefined;
    }
    parseForumImage(document) {
        if (document.documentImage) {
            return this.parseImage(document);
        }
        return document.images ? this.parseForumImages(document.images) : undefined;
    }
    parseProGalleryImage(document, isVideoThumbnail) {
        const image = this.parseImage(document);
        return isVideoThumbnail ?
            { ...image,
                isVideoThumbnail
            } :
            image;
    }
    parseUrl(document) {
        // Some multilingual sites have duplicated language in url
        // this is a workaround so those links work
        if (this.siteBaseUrl.endsWith(`/${this.language}`) &&
            document.url.startsWith(`/${this.language}/`)) {
            return `${this.siteBaseUrl}${document.url.substring(3)}`;
        }
        return `${this.siteBaseUrl}${document.url}`;
    }
    parseEventUrl(rawDocument) {
        return rawDocument ? .eventType === 'EXTERNAL' ?
            rawDocument.url :
            this.parseUrl(rawDocument);
    }
    getRelativeUrl(url) {
        return url === '' ? '/' : url;
    }
    parse(rawDocument) {
        const documentType = rawDocument.documentType;
        switch (documentType) {
            case ApiTypes.SearchDocumentType.Products:
                return this.useRawProductDocuments ?
                    rawDocument :
                    {
                        ...this.parseDefaultDocument(rawDocument),
                        price: rawDocument.discountedPrice,
                        inStock: rawDocument.inStock ? ? true,
                        currency: rawDocument.currency,
                        image: this.parseProductImage(rawDocument),
                    };
            case ApiTypes.SearchDocumentType.Pages:
                return {
                    ...this.parseDefaultDocument(rawDocument),
                };
            case ApiTypes.SearchDocumentType.Blogs:
                return {
                    ...this.parseDefaultDocument(rawDocument),
                };
            case ApiTypes.SearchDocumentType.Forums:
                return {
                    ...this.parseDefaultDocument(rawDocument),
                    contentType: rawDocument.contentType,
                    categoryTitle: rawDocument.categoryTitle,
                    createdDate: rawDocument.createdDate,
                    totalComments: rawDocument.totalComments,
                    viewCount: rawDocument.viewCount,
                    likeCount: rawDocument.likeCount,
                    upvoteCount: rawDocument.upvoteCount,
                    downvoteCount: rawDocument.downvoteCount,
                    parentId: rawDocument.parentId,
                    image: this.parseForumImage(rawDocument),
                    marked: rawDocument.marked,
                    markedComments: rawDocument.markedComments,
                    score: rawDocument.score,
                    commentInteraction: rawDocument.commentInteraction,
                };
            case ApiTypes.SearchDocumentType.Bookings:
                return {
                    ...this.parseDefaultDocument(rawDocument),
                };
            case ApiTypes.SearchDocumentType.Events:
                return {
                    ...this.parseDefaultDocument(rawDocument),
                    currency: rawDocument.currency,
                    eventType: rawDocument.eventType,
                    location: rawDocument.location &&
                        markHighlights(rawDocument.location, rawDocument._highlights ? .location),
                    maxPrice: rawDocument.maxPrice,
                    minPrice: rawDocument.minPrice,
                    startDate: rawDocument.startDate,
                    url: this.parseEventUrl(rawDocument),
                };
            case ApiTypes.SearchDocumentType.Programs:
                return {
                    ...this.parseDefaultDocument(rawDocument),
                };
            case ApiTypes.SearchDocumentType.ProGallery:
                return {
                    ...this.parseDefaultDocument(rawDocument),
                    image: this.parseProGalleryImage(rawDocument, Boolean(rawDocument.isVideo)),
                    focalPointX: rawDocument.focalPointX === undefined ?
                        undefined :
                        rawDocument.focalPointX * 100,
                    focalPointY: rawDocument.focalPointY === undefined ?
                        undefined :
                        rawDocument.focalPointY * 100,
                };
            default:
                // typechecking if we forgot any SearchDocumentType.
                // in runtime, function will still work if we got an unknown document type from the backend
                const unknownDocumentType = documentType;
                // eslint-disable-next-line no-console
                console.warn(`You're trying to parse unknown document type - ${rawDocument.documentType}`);
                return {
                    ...this.parseDefaultDocument(rawDocument),
                    documentType: unknownDocumentType,
                };
        }
    }
}
//# sourceMappingURL=DocumentParser.js.map