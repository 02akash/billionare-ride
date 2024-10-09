import { CreateControllerFn } from '@wix/yoshi-flow-editor';
import { searchAppControllerFactory } from './platform/controllerFactory';
import { extendControllerParams } from '../../lib/extendControllerParams';

const createController: CreateControllerFn = async (params) => {
  const extendedParams = extendControllerParams(params);
  return searchAppControllerFactory(extendedParams);
};

export default createController;
