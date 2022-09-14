import './Item.sass';
import React, {ReactNode, CSSProperties} from 'react';
import cn from '../cn';

export interface Props {
	children: Mix;
	maxWidth?: number;
	maxHeight?: number;
}

export type Mix = (props: MixProps) => ReactNode | void;

export interface MixProps {
	className: string;
	style: CSSProperties;
}

export default function ContainerItem({
	children,
	maxWidth,
	maxHeight
}: Props) {
	const cnBase = cn('Container', 'Item');
	return <>{children({
		className: cnBase(),
		style: {
			[`--${cnBase()}_maxWidth`]: maxWidth,
			[`--${cnBase()}_maxHeight`]: maxHeight
		}
	})}</>;
}