import {
    SearchDocumentType
} from './api.types';
const fieldsByDocumentType = {
    [SearchDocumentType.Products]: ['currency', 'discountedPrice', 'inStock'],
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
    [SearchDocumentType.ProGallery]: ['focalPointY', 'focalPointX', 'isVideo'],
};
export function getFieldsByDocumentType(documentType) {
    if (!documentType) {
        return;
    }
    const extraFields = fieldsByDocumentType[documentType] || [];
    return ['description', 'title', 'id'].concat(extraFields);
}
//# sourceMappingURL=getFieldsByDocumentType.js.map