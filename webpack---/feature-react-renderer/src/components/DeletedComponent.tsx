import { withDependencies } from '@wix/thunderbolt-ioc'
import React, { FC } from 'react'
import { IRendererPropsExtender } from '@wix/thunderbolt-symbols'

interface IProps {
	BaseComponent: FC<any>
}

const DeletedComponent = ({ BaseComponent }: IProps) => {
	return (
		<BaseComponent
			style={{
				visibility: 'hidden',
				overflow: 'hidden',
				pointerEvents: 'none',
			}}
		/>
	)
}

export const DeletedCompPropsProvider = withDependencies(
	[],
	(): IRendererPropsExtender => {
		return {
			async extendRendererProps() {
				return {
					DeletedComponent: DeletedComponent as FC<any>,
				}
			},
		}
	}
)
