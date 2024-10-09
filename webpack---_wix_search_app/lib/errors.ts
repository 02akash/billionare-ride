import { ErrorMonitor, TagsBucket } from '@wix/yoshi-flow-editor/error-monitor';

export const reportError = (
  errorMonitor: ErrorMonitor,
  error: unknown,
  tags?: TagsBucket,
) => {
  console.error(error); // eslint-disable-line no-console

  if (error instanceof Error) {
    errorMonitor.captureException(error, { tags });
  } else if (typeof error === 'string') {
    errorMonitor.captureMessage(error, { tags });
  }
};
