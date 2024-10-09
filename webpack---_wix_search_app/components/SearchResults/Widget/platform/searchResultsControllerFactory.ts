import { createEventHandler } from '@wix/tpa-settings';
import { AppSettings } from '@wix/search-settings-client';

import {
  IControllerConfig,
  ControllerFactory,
} from '../../../../lib/platform.types';
import { SearchResultsControllerStore } from './searchResultsControllerStore';
import { createSlotVeloAPIFactory } from '@wix/widget-plugins-ooi/velo';
import { SLOTS } from '../../../../lib/slots';
import { Spec } from '@wix/site-search-common';

interface ISettingsEvents {
  previewStateChange: {
    shouldHaveSearchResults: boolean;
  };
  appSettingsChange: AppSettings;
}

export const searchResultsControllerFactory: ControllerFactory = async (
  params,
) => {
  const {
    config,
    flowAPI: { experiments },
  } = params;

  const eventHandler = createEventHandler<ISettingsEvents>(
    config.publicData.COMPONENT,
  );

  const controllerStore = new SearchResultsControllerStore(params);

  eventHandler.on(
    'previewStateChange',
    (value: ISettingsEvents['previewStateChange']) => {
      controllerStore.updateDemoMode(value);
    },
  );

  eventHandler.on('appSettingsChange', (appSettings: AppSettings) => {
    controllerStore.updateSettings(appSettings);
  });

  eventHandler.onReset(() => {
    controllerStore.updateDemoMode({
      shouldHaveSearchResults: true,
    });
  });

  return {
    async pageReady() {
      // TODO: need to see if we can know here if slot was added
      const shouldContainProductWidget = experiments.enabled(
        Spec.SearchResultsPageProductsSlot,
      );
      await controllerStore.setInitialState(shouldContainProductWidget);

      if (shouldContainProductWidget) {
        const slotAPIFactory = createSlotVeloAPIFactory(params);
        const productsSlot = slotAPIFactory.getSlotAPI(SLOTS.products.id);
        await controllerStore.setProductsWidgetCallBacks({ productsSlot });
      }
      return;
    },

    updateConfig($w, updatedConfig) {
      const { publicData } = updatedConfig as IControllerConfig['config'];
      eventHandler.notify(publicData.COMPONENT); // Trigger events
      // To update widget in editor when settings change
      controllerStore.updateSettings();
    },
  };
};
