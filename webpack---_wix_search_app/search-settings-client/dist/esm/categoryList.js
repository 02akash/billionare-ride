import {
    SearchDocumentType
} from '@wix/client-search-sdk';
export const defaultCategoryList = {
    [SearchDocumentType.All]: {
        index: 100,
        visible: false,
        useOverride: false,
        override: '',
    },
    [SearchDocumentType.Products]: {
        index: 110,
        visible: true,
        useOverride: false,
        override: '',
    },
    [SearchDocumentType.Bookings]: {
        index: 120,
        visible: true,
        useOverride: false,
        override: '',
    },
    [SearchDocumentType.Events]: {
        index: 130,
        visible: true,
        useOverride: false,
        override: '',
    },
    [SearchDocumentType.Blogs]: {
        index: 140,
        visible: true,
        useOverride: false,
        override: '',
    },
    [SearchDocumentType.Pages]: {
        index: 150,
        visible: true,
        useOverride: false,
        override: '',
    },
    [SearchDocumentType.Forums]: {
        index: 160,
        visible: true,
        useOverride: false,
        override: '',
    },
    [SearchDocumentType.Programs]: {
        index: 170,
        visible: true,
        useOverride: false,
        override: '',
    },
    [SearchDocumentType.ProGallery]: {
        index: 180,
        visible: true,
        useOverride: false,
        override: '',
    },
};
//# sourceMappingURL=categoryList.js.map