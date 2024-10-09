import { CreateControllerFn } from '@wix/yoshi-flow-editor';
import { searchResultsControllerFactory } from './Widget/platform/searchResultsControllerFactory';
import { extendControllerParams } from '../../lib/extendControllerParams';

const createController: CreateControllerFn = async (params) => {
  const extendedParams = extendControllerParams(params);
  return searchResultsControllerFactory(extendedParams);
};

export default createController;
