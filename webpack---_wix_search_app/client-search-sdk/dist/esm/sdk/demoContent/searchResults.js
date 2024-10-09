import {
    SearchDocumentType,
    ForumContentType,
} from '../../api/api.types';
import {
    ClientSearchDocumentBuilder
} from '../sdk.builder';

function mockImage(name) {
    return {
        name,
        width: 1000,
        height: 1000,
    };
}
const MOCK_URL = 'https://wix.com';
const PAGES = [{
        id: '',
        documentType: SearchDocumentType.Pages,
        title: 'mockedSearchResults.pages.5.title',
        documentImage: mockImage('b88f2d5da73042e2b86399ab9f21367f.jpg'),
        description: 'mockedSearchResults.pages.5.description',
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.Pages,
        title: 'mockedSearchResults.pages.4.title',
        documentImage: mockImage('7f0f209fce404b8a8b21ee10de5c4118.jpg'),
        description: 'mockedSearchResults.pages.4.description',
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.Pages,
        title: 'mockedSearchResults.pages.3.title',
        documentImage: mockImage('5e7d2ea14bb841b4ad61e1a43c4fdfad.jpg'),
        description: 'mockedSearchResults.pages.3.description',
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.Pages,
        title: 'mockedSearchResults.pages.2.title',
        documentImage: mockImage('1a77bf468f24468b954aba15ddd8b1e2.png'),
        description: 'mockedSearchResults.pages.2.description',
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.Pages,
        title: 'mockedSearchResults.pages.1.title',
        documentImage: mockImage('3273c6e2911e44059093e6011be353a5.jpg'),
        description: 'mockedSearchResults.pages.1.description',
        url: MOCK_URL,
    },
];
const PRODUCT_TITLE = 'mockedSearchResults.products.1.title';
const PRODUCT_DESCRIPTION = 'mockedSearchResults.products.1.description';
const PRODUCTS = [{
        id: '',
        documentType: SearchDocumentType.Products,
        title: PRODUCT_TITLE,
        documentImage: mockImage('a9ff3b_9928686dcfa740bd802821d0b6f4ac03.jpg'),
        description: PRODUCT_DESCRIPTION,
        discountedPrice: '$85.00',
        currency: 'USD',
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.Products,
        title: PRODUCT_TITLE,
        documentImage: mockImage('a9ff3b_1eec973ae9eb43f4bca9876e5d90f6fa.jpg'),
        description: PRODUCT_DESCRIPTION,
        discountedPrice: '$20.00',
        currency: 'USD',
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.Products,
        title: PRODUCT_TITLE,
        documentImage: mockImage('a9ff3b_119100d8c0144221b2f6733f4d205d2e.jpg'),
        description: PRODUCT_DESCRIPTION,
        discountedPrice: '$10.00',
        currency: 'USD',
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.Products,
        title: PRODUCT_TITLE,
        documentImage: mockImage('a9ff3b_c6158b4d41784ae8b08337a331e1de7f.jpg'),
        description: PRODUCT_DESCRIPTION,
        discountedPrice: '$25.00',
        currency: 'USD',
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.Products,
        title: PRODUCT_TITLE,
        documentImage: mockImage('a9ff3b_03155a7e79bd4cca9aaf3f0e98378100.jpg'),
        description: PRODUCT_DESCRIPTION,
        discountedPrice: '$7.50',
        currency: 'USD',
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.Products,
        title: PRODUCT_TITLE,
        documentImage: mockImage('a9ff3b_5bc54b597d67423d8022157cef968f7b.jpg'),
        description: PRODUCT_DESCRIPTION,
        discountedPrice: '$15.00',
        currency: 'USD',
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.Products,
        title: PRODUCT_TITLE,
        documentImage: mockImage('a9ff3b_5e32b6d9419343c29c68e9173b5461e0.jpg'),
        description: PRODUCT_DESCRIPTION,
        discountedPrice: '$85.00',
        currency: 'USD',
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.Products,
        title: PRODUCT_TITLE,
        documentImage: mockImage('a9ff3b_ea68bd8398ac489a8e4e8b99755f96b0.jpg'),
        description: PRODUCT_DESCRIPTION,
        discountedPrice: '$40.00',
        currency: 'USD',
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.Products,
        title: PRODUCT_TITLE,
        documentImage: mockImage('a9ff3b_849d96e85f044bc7ae0a47f78d9a898b.jpg'),
        description: PRODUCT_DESCRIPTION,
        discountedPrice: '$130.00',
        currency: 'USD',
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.Products,
        title: PRODUCT_TITLE,
        documentImage: mockImage('a9ff3b_18ef3d9c8058444ea08059329237a1f2.jpg'),
        description: PRODUCT_DESCRIPTION,
        discountedPrice: '$45.00',
        currency: 'USD',
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.Products,
        title: PRODUCT_TITLE,
        documentImage: mockImage('a9ff3b_f9b427f2017641468a0b939aa26777b5.jpg'),
        description: PRODUCT_DESCRIPTION,
        discountedPrice: '$95.00',
        currency: 'USD',
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.Products,
        title: PRODUCT_TITLE,
        documentImage: mockImage('a9ff3b_ed3b544c319b4fad9c222c791a997832.jpg'),
        description: PRODUCT_DESCRIPTION,
        discountedPrice: '$120.00',
        currency: 'USD',
        url: MOCK_URL,
    },
];
const BLOGS = [{
        id: '',
        documentType: SearchDocumentType.Blogs,
        title: 'mockedSearchResults.blog.3.title',
        documentImage: mockImage('a27d24_74a5c4593cc1454683305dbaa50c80cb~mv2_d_1880_1560_s_2.png'),
        description: 'mockedSearchResults.blog.2.description',
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.Blogs,
        title: 'mockedSearchResults.blog.2.title',
        documentImage: mockImage('a27d24_f116a7916f5544a79f92d43b4247a457~mv2_d_2845_1900_s_2.jpg'),
        description: 'mockedSearchResults.blog.2.description',
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.Blogs,
        title: 'mockedSearchResults.blog.1.title',
        documentImage: mockImage('a27d24_e1ac8887d0e04dd5b98fb4c263af1180~mv2_d_4915_3277_s_4_2.jpg'),
        description: 'mockedSearchResults.blog.1.description',
        url: MOCK_URL,
    },
];
const PRO_GALLERY_TITLE = 'mockedSearchResults.proGallery.1.title';
const PRO_GALLERY_DESCRIPTION = 'mockedSearchResults.proGallery.1.description';
const PRO_GALLERY = [{
        id: '',
        documentType: SearchDocumentType.ProGallery,
        title: PRO_GALLERY_TITLE,
        documentImage: mockImage('8bb438_3ae04589aef4480e89a24d7283c69798~mv2_d_2869_3586_s_4_2.jpg'),
        description: PRO_GALLERY_DESCRIPTION,
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.ProGallery,
        title: PRO_GALLERY_TITLE,
        documentImage: mockImage('8bb438_734b8f436e944886b4185aa6f72b5cad~mv2_d_3000_2000_s_2.jpg'),
        description: PRO_GALLERY_DESCRIPTION,
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.ProGallery,
        title: PRO_GALLERY_TITLE,
        documentImage: mockImage('8bb438_ac2af14459894a6cbce641b7d8af9dc9~mv2_d_3000_2000_s_2.jpg'),
        description: PRO_GALLERY_DESCRIPTION,
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.ProGallery,
        title: PRO_GALLERY_TITLE,
        documentImage: mockImage('8bb438_b596f0cc1c134605b59843a052cd8f37~mv2_d_3000_2930_s_4_2.jpg'),
        description: PRO_GALLERY_DESCRIPTION,
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.ProGallery,
        title: PRO_GALLERY_TITLE,
        documentImage: mockImage('8bb438_288176fe374c49949c53917e808c1410~mv2_d_8192_7754_s_4_2.jpg'),
        description: PRO_GALLERY_DESCRIPTION,
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.ProGallery,
        title: PRO_GALLERY_TITLE,
        documentImage: mockImage('8bb438_ec9a72099f9648dfb08d9412804a464a~mv2_d_3000_2000_s_2.jpg'),
        description: PRO_GALLERY_DESCRIPTION,
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.ProGallery,
        title: PRO_GALLERY_TITLE,
        documentImage: mockImage('8bb438_cb8e4681180a4bf39d73b69a7d51f086~mv2_d_3000_1688_s_2.jpg'),
        description: PRO_GALLERY_DESCRIPTION,
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.ProGallery,
        title: PRO_GALLERY_TITLE,
        documentImage: mockImage('8bb438_852a4859469e429895c88eecaac7f466~mv2_d_3000_1995_s_2.jpg'),
        description: PRO_GALLERY_DESCRIPTION,
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.ProGallery,
        title: PRO_GALLERY_TITLE,
        documentImage: mockImage('8bb438_1821368fde7d4eb1afed09b1fdb53532~mv2_d_3000_1946_s_2.jpg'),
        description: PRO_GALLERY_DESCRIPTION,
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.ProGallery,
        title: PRO_GALLERY_TITLE,
        documentImage: mockImage('8bb438_751cbc8f34e14fa2ba5dbfd8b5174c20~mv2_d_3000_2002_s_2.jpg'),
        description: PRO_GALLERY_DESCRIPTION,
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.ProGallery,
        title: PRO_GALLERY_TITLE,
        documentImage: mockImage('8bb438_5ae585140ab442d49138ef3ccbf8fdb8~mv2_d_3000_3000_s_4_2.jpg'),
        description: PRO_GALLERY_DESCRIPTION,
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.ProGallery,
        title: PRO_GALLERY_TITLE,
        documentImage: mockImage('8bb438_0ab7a3ec93cf434cb89081f5272b5dac~mv2_d_3000_1941_s_2.jpg'),
        description: PRO_GALLERY_DESCRIPTION,
        url: MOCK_URL,
    },
    {
        id: '',
        documentType: SearchDocumentType.ProGallery,
        title: PRO_GALLERY_TITLE,
        documentImage: mockImage('8bb438_98999c7be5814da8a012bb8d32aa6a47~mv2_d_3000_1965_s_2.jpg'),
        description: PRO_GALLERY_DESCRIPTION,
        url: MOCK_URL,
    },
];
const FORUMS = [{
        id: '',
        documentType: SearchDocumentType.Forums,
        title: 'mockedSearchResults.forum.1.title',
        description: 'mockedSearchResults.forum.1.description',
        documentImage: mockImage('a27d24_74a5c4593cc1454683305dbaa50c80cb~mv2_d_1880_1560_s_2.png'),
        url: MOCK_URL,
        contentType: ForumContentType.Post,
        categoryTitle: 'Some Forum Category',
        createdDate: '2021-12-09T09:00:00.000Z',
        downvoteCount: 0,
        likeCount: 1,
        totalComments: 3,
        upvoteCount: 0,
        viewCount: 0,
        markedComments: ['some-comment-id'],
    },
    {
        id: '',
        parentId: '61312e36-661f-11eb-ae93-0242ac130002',
        documentType: SearchDocumentType.Forums,
        title: 'mockedSearchResults.forum.2.title',
        description: 'mockedSearchResults.forum.2.description',
        documentImage: mockImage('a27d24_e1ac8887d0e04dd5b98fb4c263af1180~mv2_d_4915_3277_s_4_2.jpg'),
        url: MOCK_URL,
        contentType: ForumContentType.Comment,
        categoryTitle: 'Another Forum Category',
        createdDate: '2021-06-09T12:00:00.000Z',
        totalComments: 0,
        viewCount: 0,
        likeCount: 6,
        upvoteCount: 0,
        downvoteCount: 0,
        marked: true,
    },
    {
        id: '',
        documentType: SearchDocumentType.Forums,
        title: 'mockedSearchResults.forum.3.title',
        description: 'mockedSearchResults.forum.3.description',
        documentImage: mockImage('a27d24_e1ac8887d0e04dd5b98fb4c263af1180~mv2_d_4915_3277_s_4_2.jpg'),
        url: MOCK_URL,
        contentType: ForumContentType.Comment,
        categoryTitle: 'Last Forum Category',
        createdDate: '2020-10-09T12:00:00.000Z',
        totalComments: 1,
        viewCount: 0,
        likeCount: 1,
        upvoteCount: 0,
        downvoteCount: 0,
    },
];
const ALL_TYPES = [
    PAGES[0],
    PRODUCTS[0],
    BLOGS[0],
    PAGES[1],
    PRODUCTS[1],
    BLOGS[1],
    PAGES[2],
    PRODUCTS[2],
    BLOGS[2],
    PAGES[3],
    PRODUCTS[3],
    PAGES[4],
    PRODUCTS[4],
];

function shiftBasedOnQuery(query) {
    // shift can be the same for some queries, resulting in the same mock results. oh well
    if (!query) {
        return 0;
    }
    let shift = 0;
    const length = query.length;
    for (let i = 0; i < length; i++) {
        shift = (shift + query.charCodeAt(i)) % 100;
    }
    return shift;
}

function shiftBasedOnPagination(skip) {
    return Math.floor(skip / 10);
}

function mockResultsMapper(mock) {
    const builder = new ClientSearchDocumentBuilder();
    builder.withTitle(mock.title);
    builder.withDescription(mock.description);
    builder.withDocumentType(mock.documentType);
    builder.withImage(mock.documentImage);
    if (mock.documentType === SearchDocumentType.Products) {
        builder.withCurrency(mock.currency);
        builder.withPrice(mock.discountedPrice);
    } else if (mock.documentType === SearchDocumentType.Forums) {
        builder.withField('contentType', mock.contentType);
        builder.withField('categoryTitle', mock.categoryTitle);
        builder.withField('createdDate', mock.createdDate);
        builder.withField('downvoteCount', mock.downvoteCount);
        builder.withField('likeCount', mock.likeCount);
        builder.withField('totalComments', mock.totalComments);
        builder.withField('upvoteCount', mock.upvoteCount);
        builder.withField('viewCount', mock.viewCount);
        builder.withField('parentId', mock.parentId);
        builder.withField('marked', mock.marked);
        builder.withField('markedComments', mock.markedComments);
    }
    return builder.getResponse();
}

function generateMockResults(mocks, config) {
    const documents = mocks.map(mockResultsMapper);
    // reversing to avoid the same search results
    // on "empty_query + page_after_first" and "some_query + page_1",
    // because in both cases we just shift/cycle/rotate mock data (`resultsShift`)
    const query = config.query === '*' ? '' : config.query;
    if (!query) {
        documents.reverse();
    }
    const resultsShift = (shiftBasedOnQuery(query) + shiftBasedOnPagination(config.skip)) %
        documents.length;
    const results = [];
    let counter = resultsShift;
    for (let i = 0; i < config.limit; i++) {
        if (counter >= documents.length) {
            counter = 0;
        }
        results.push({
            ...documents[counter],
            id: i.toString(),
        });
        counter++;
    }
    return results;
}
export function getDemoSearchResults(config) {
    if (config.limit === 0) {
        return [];
    }
    let mocks = [];
    switch (config.documentType) {
        case SearchDocumentType.Products:
            mocks = PRODUCTS;
            break;
        case SearchDocumentType.Pages:
            mocks = PAGES;
            break;
        case SearchDocumentType.Blogs:
            mocks = BLOGS;
            break;
        case SearchDocumentType.ProGallery:
            mocks = PRO_GALLERY;
            break;
        case SearchDocumentType.Forums:
            mocks = FORUMS;
            break;
        default:
            mocks = ALL_TYPES.map((document) => ({
                ...document,
                documentType: config.documentType,
            }));
    }
    return generateMockResults(mocks, {
        limit: config.limit,
        skip: config.skip,
        query: config.query,
    });
}
//# sourceMappingURL=searchResults.js.map