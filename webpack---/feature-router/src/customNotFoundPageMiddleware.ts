import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { SiteFeatureConfigSymbol, Experiments, ExperimentsSymbol } from '@wix/thunderbolt-symbols'
import type { IRoutingConfig, IRoutingMiddleware } from './types'
import { name } from './symbols'
import { errorPagesIds } from '@wix/thunderbolt-commons'

const customNotFoundPageMiddleware = (routingConfig: IRoutingConfig, experiments: Experiments): IRoutingMiddleware => ({
	handle: async (routeInfo) => {
		const fixPartialRoute404Experiment = experiments['specs.thunderbolt.fixPartialRouteMatchNotFoundPages']
		const isFixPartialRoute404ExperimentOn =
			typeof fixPartialRoute404Experiment === 'string'
				? fixPartialRoute404Experiment === 'true'
				: fixPartialRoute404Experiment

		const isPartialRouteMatch = isFixPartialRoute404ExperimentOn && routeInfo.type === 'Static'

		if (
			(!routeInfo.pageId || routeInfo.pageId === errorPagesIds._404_dp || isPartialRouteMatch) &&
			routingConfig.customNotFoundPage?.pageId
		) {
			return {
				...routeInfo,
				pageId: routingConfig.customNotFoundPage?.pageId,
				relativeUrl: routingConfig.customNotFoundPage?.pageRoute,
			}
		}
		return routeInfo
	},
})

export const CustomNotFoundPageMiddleware = withDependencies(
	[named(SiteFeatureConfigSymbol, name), ExperimentsSymbol],
	customNotFoundPageMiddleware
)
