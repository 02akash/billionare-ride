import { useEffect, useState } from 'react';
import { useAppState } from './app-state';
import { useCollapseExpand } from './collapse-expand';
import { useServices } from './services-registry';

export const useFirstExpandReporter = () => {
  const collapseExpand = useCollapseExpand();
  const [wasFirstExpandReported, setFirstExpandReported] = useState(false);
  const { serverApi, experiments } = useServices();
  const { allowInput } = useAppState();
  const isUseNewPcfServiceEnabled = experiments.enabled(
    'specs.chat.usePcfService',
  );

  useEffect(() => {
    if (collapseExpand.isExpanded && !wasFirstExpandReported) {
      if (!isUseNewPcfServiceEnabled) {
        serverApi.reportFirstExpand(allowInput);
      }
      serverApi.reportChatWidgetOpen();
      setFirstExpandReported(true);
    }
  }, [
    collapseExpand.isExpanded,
    wasFirstExpandReported,
    serverApi,
    allowInput,
  ]);
};
