import { SearchDocumentType } from '@wix/client-search-sdk';

export enum SearchRequestStatus {
  Initial,
  Loading,
  Loaded,
  Failed,
}

export enum DocumentTypeChangeSource {
  ViewAllButton,
  Tab,
}

export interface ITab {
  documentType: SearchDocumentType;
  count: number;
  title: string;
}
