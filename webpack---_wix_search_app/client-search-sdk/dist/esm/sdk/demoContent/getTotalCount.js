import {
    SearchDocumentType
} from '../../api/api.types';
const totalCounts = {
    [SearchDocumentType.Pages]: 73,
    [SearchDocumentType.Products]: 64,
    [SearchDocumentType.Blogs]: 58,
    [SearchDocumentType.Forums]: 46,
    [SearchDocumentType.Bookings]: 31,
    [SearchDocumentType.Events]: 23,
    [SearchDocumentType.Programs]: 29,
    [SearchDocumentType.ProGallery]: 54,
};
const DEFAULT_TOTAL_COUNT = 10;
export function getTotalCount(documentType) {
    return totalCounts[documentType] ? ? DEFAULT_TOTAL_COUNT;
}
//# sourceMappingURL=getTotalCount.js.map