import './index.sass';
import React, {ComponentProps, ReactNode, Ref} from 'react';
import cn from '../cn';
import Item, {Mix} from './Item';

export interface DOMProps extends Omit<ComponentProps<'div'>, 'children'> {
	domRef?: Ref<HTMLDivElement>;
}

export interface Props<WithItem extends boolean = false> extends DOMProps {
	children: WithItem extends true ? Mix : ReactNode | undefined;
	direction?: 'horizontal' | 'vertical';
	positioning?: 'stretch' | 'center' | 'offset';
	strictPositioning?: WithItem extends true ? boolean : never;
	startOffset?: number;
	endOffset?: number;
}

export default function Container<WithItem extends boolean>({
	domRef,
	children,
	className,
	style = {},
	direction,
	positioning = 'stretch',
	strictPositioning,
	startOffset,
	endOffset,
	...domProps
}: Props<WithItem>) {
	const availableSpace = 1 - (startOffset ?? 0) - (endOffset ?? 0);

	const cnBase = cn('Container');
	return (
		<div
			ref={domRef}
			className={cnBase({
				direction, positioning, strictPositioning
			}, [className])}
			style={{
				...style,
				[`--${cnBase()}_startOffset`]: startOffset,
				[`--${cnBase()}_endOffset`]: endOffset
			}}
			{...domProps}
		>
			{typeof children === 'function'
				? <Item
					maxWidth={
						strictPositioning && direction === 'horizontal'
							? availableSpace : undefined
					}
					maxHeight={
						strictPositioning && direction === 'vertical'
							? availableSpace : undefined
					}
				>
					{children}
				</Item>
				: children
			}
		</div>
	);
}