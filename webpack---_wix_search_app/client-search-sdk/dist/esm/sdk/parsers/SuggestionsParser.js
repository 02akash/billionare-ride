import {
    SearchDocumentType
} from '../sdk.types';
import {
    DocumentParser
} from './documentParser';
import * as messagesEn from '../../assets/locales/messages_en.json';
const getDocumentTypeTitleTranslations = () => ({
    [SearchDocumentType.All]: 'documentType.title.all',
    [SearchDocumentType.Pages]: 'documentType.title.otherPages',
    [SearchDocumentType.Products]: 'documentType.title.products',
    [SearchDocumentType.Blogs]: 'documentType.title.blogs',
    [SearchDocumentType.Forums]: 'documentType.title.forums',
    [SearchDocumentType.Bookings]: 'documentType.title.bookings',
    [SearchDocumentType.Events]: 'documentType.title.events',
    [SearchDocumentType.Programs]: 'documentType.title.programs',
    [SearchDocumentType.ProGallery]: 'documentType.title.proGallery',
});
const getDocumentTypeTrendingTranslations = () => ({
    [SearchDocumentType.Pages]: 'documentType.trending.otherPages',
    [SearchDocumentType.Products]: 'documentType.trending.products',
    [SearchDocumentType.Blogs]: 'documentType.trending.blogs',
    [SearchDocumentType.Forums]: 'documentType.trending.forums',
    [SearchDocumentType.Bookings]: 'documentType.trending.bookings',
    [SearchDocumentType.Events]: 'documentType.trending.events',
    [SearchDocumentType.Programs]: 'documentType.trending.programs',
    [SearchDocumentType.ProGallery]: 'documentType.trending.proGallery',
});

function groupBy(array, key) {
    return array.reduce((objectsByKeyValue, obj) => {
        const keyValue = key(obj);
        objectsByKeyValue[keyValue] = (objectsByKeyValue[keyValue] || []).concat(obj);
        return objectsByKeyValue;
    }, {});
}

function initTranslations(language) {
    let messages = messagesEn;
    try {
        messages = require(`../../assets/locales/messages_${language}.json`);
    } catch (e) {
        //
    }
    const titleTranslations = getDocumentTypeTitleTranslations();
    const trendingTranslations = getDocumentTypeTrendingTranslations();

    function getDocumentTypeTitle(documentType) {
        const key = titleTranslations[documentType];
        if (!key) {
            return documentType;
        }
        return messages[key] || messagesEn[key] || documentType;
    }

    function getDocumentTypeTrendingTitle(documentType) {
        if (documentType === SearchDocumentType.All) {
            return documentType;
        }
        const key = trendingTranslations[documentType];
        if (!key) {
            return documentType;
        }
        return messages[key] || messagesEn[key] || documentType;
    }
    return {
        getDocumentTypeTitle,
        getDocumentTypeTrendingTitle
    };
}
export class SuggestionsParser {
    constructor(siteBaseUrl, language) {
        this.documentParser = new DocumentParser(siteBaseUrl, language);
        const {
            getDocumentTypeTitle,
            getDocumentTypeTrendingTitle
        } = initTranslations(language);
        this.getDocumentTypeTitle = getDocumentTypeTitle;
        this.getDocumentTypeTrendingTitle = getDocumentTypeTrendingTitle;
    }
    parse(suggestions) {
        const grouped = groupBy(suggestions, (v) => v.documentType);
        const parse = (document) => this.documentParser.parse(document);
        const groupedSuggestions = Object.keys(grouped).map((documentType) => ({
            title: this.getDocumentTypeTitle(documentType),
            documentType,
            options: grouped[documentType].map(parse),
        }));
        return groupedSuggestions;
    }
}
//# sourceMappingURL=SuggestionsParser.js.map