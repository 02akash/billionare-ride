import userController from '/home/builduser/work/d7a4e0f42d2e4b8d/packages/wixstores-client-gallery/src/components/SliderGallery/controller.ts';
import createControllerWrapper from '@wix/yoshi-flow-editor/runtime/esm/controllerWrapper.js';


const wrapController = null;



var createHttpClient = null;


var initI18n = null;


const multilingualDisabled = false;



var createExperiments = null;
var createWidgetExperiments = null;



var sentryConfig = {
    DSN: 'https://a49da440f96748c7842c6c24ab759ce9@sentry-next.wixpress.com/13169',
    id: '337a342c302c4c0e8c26e425e74da4c1',
    projectName: 'gallery-viewer',
    teamName: 'ecom-storefront-catalog-client',
    errorMonitor: true,
};

var experimentsConfig = {
    "scopes": ["viewer-apps-1380b703-ce81-ff05-f115-39571d94dfcd"],
    "centralized": true
};

var translationsConfig = {
    "enabled": false,
    "icuEnabled": false
};

var biConfig = null;

var defaultTranslations = null;

var fedopsConfig = null;

import {
    createVisitorBILogger as biLogger
} from '/home/builduser/work/d7a4e0f42d2e4b8d/packages/wixstores-client-gallery/target/generated/bi/createBILogger.ts';

const controllerOptions = {
    sentryConfig,
    biConfig,
    fedopsConfig,
    experimentsConfig,
    biLogger,
    translationsConfig,
    persistentAcrossPages: false,
    appName: null,
    componentName: "SliderGallery",
    appDefinitionId: "1380b703-ce81-ff05-f115-39571d94dfcd",
    componentId: "139a41fd-0b1d-975f-6f67-e8cbdf8ccc82",
    projectName: "wixstores-client-gallery",
    defaultTranslations,
    multilingualDisabled,
    shouldUseEssentials: true,
    withErrorBoundary: false,
    localeDistPath: "assets/locales"
};

const _controller = createControllerWrapper(userController, controllerOptions, {
    initI18n,
    createHttpClient,
    createExperiments,
});

export const wrap = wrapController;
export const descriptor = {
    ...controllerOptions,
    id: controllerOptions.componentId,
    widgetType: "WIDGET_OUT_OF_IFRAME",
    controllerFileName: "/home/builduser/work/d7a4e0f42d2e4b8d/packages/wixstores-client-gallery/src/components/SliderGallery/controller.ts",
};

export const controller = _controller
export default controller;