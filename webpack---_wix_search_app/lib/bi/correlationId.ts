import { guid } from '../guid';

export function createBiCorrelationId(): string {
  return guid();
}
