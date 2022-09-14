import './index.sass';
import React, {useState, useRef, useLayoutEffect, ReactNode} from 'react';
import cn from '../cn';
import Container, {Props as ContainerProps} from '../Container';
import Content, {Props as ContentProps} from './Content';

export interface Props {
	children?: ReactNode;
	active?: boolean;
	calculatePosition: CalculatePosition;
	renderMode?: 'always' | 'whenActive' | 'afterFirstActivate';
}

export type CalculatePosition = (space: DOMRect) => Position;

export interface Position {
	top?: number;
	right?: number;
	bottom?: number;
	left?: number;
	verticalPosition?: PositionType;
	horizontalPosition?: PositionType;
}

type PositionType =
	ContainerProps<true>['positioning']
	| `${Required<ContainerProps<true>>['positioning']}Strict`;

export default function Popup({
	children,
	active = false,
	calculatePosition,
	renderMode = 'always'
}: Props) {
	const element = useRef<HTMLDivElement>(null);

	const wasActiveOnce = useRef(false);
	if (active)
		wasActiveOnce.current = true;

	const [{
		top, right, bottom, left, verticalPosition, horizontalPosition
	}, setPosition] = useState<Position>({});
	useLayoutEffect(() => {
		if (active && element.current)
			setPosition(calculatePosition(
				element.current.getBoundingClientRect()
			));
	}, [active, calculatePosition]);

	const result = (
		<Container
			domRef={element}
			className={cn('Popup')()}
			direction="vertical"
			{...parsePositionType(verticalPosition)}
			startOffset={top}
			endOffset={bottom}
		>
			{props => <Container
				direction="horizontal"
				{...parsePositionType(horizontalPosition)}
				startOffset={left}
				endOffset={right}
				{...props}
			>
				{props => <Content {...props}>{children}</Content>}
			</Container>}
		</Container>
	);

	switch (renderMode) {
		case 'always': return result;
		case 'whenActive': return active ? result : null;
		case 'afterFirstActivate': return wasActiveOnce.current ? result : null;
	}
}

function parsePositionType(
	type?: PositionType
): Partial<Pick<ContainerProps<true>, 'positioning' | 'strictPositioning'>> {
	if (!type)
		return {};
	const strictIndex = type.indexOf('Strict');
	return strictIndex === -1 ? {
		positioning: type as ContainerProps<true>['positioning']
	} : {
		positioning: type.slice(0, strictIndex) as
			ContainerProps<true>['positioning'],
		strictPositioning: true
	};
}