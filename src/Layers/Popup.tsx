import './Popup.sass';
import React, {useState, useRef, useMemo, useCallback, ReactNode} from 'react';
import {createPortal} from 'react-dom';
import cn from '../cn';
import Container from '../Container';
import Popup, {
	Props as TargetProps, Position, CalculatePosition as CalculateTargetPosition
} from '../Popup';
import Control, {useLayersControlContext} from './Control';

export interface Props {
	children: Render<{
		toggle: ReactNode;
		content: ReactNode;
	}>;
	calculatePosition: CalculatePosition;
	renderMode: TargetProps['renderMode'];
}

export type Render<Format = ReactNode> = (
	active: boolean,
	activate: Activate
) => Format;

export type CalculatePosition = (
	relativeToggle: DOMRect,
	toggle: DOMRect,
	space: DOMRect
) => Position;

export type Activate = (
	active?: unknown
) => void;

export default function LayersPopup({
	children,
	calculatePosition,
	renderMode
}: Props) {
	const {frontLayer, setCurrentComponent, nesting} =
		useLayersControlContext();
	const toggleElement = useRef<HTMLDivElement>(null);

	const [active, setActive] = useState(false);
	const activate: Activate = useCallback(active => setActive(wasActive => {
		if (typeof active === 'function')
			active = active(wasActive);
		const makeActive = typeof active === 'boolean' ? active : !wasActive;
		if (wasActive !== makeActive)
			setCurrentComponent(() => setActive(false));
		setActive(makeActive);
		return makeActive;
	}), [setCurrentComponent]);

	const calculateRelativePosition: CalculateTargetPosition =
		useCallback(space => {
			const toggleSize =
				(toggleElement.current as HTMLDivElement).getBoundingClientRect();
			return calculatePosition(new DOMRect(
				(toggleSize.x - space.x) / space.width,
				(toggleSize.y - space.y) / space.height,
				toggleSize.width / space.width,
				toggleSize.height / space.height
			), toggleSize, space);
		}, [calculatePosition]);

	const {toggle, content} = useMemo(() =>
		children(active, activate)
	, [children, active, activate]);

	const cnBase = cn('Layers', 'Popup');
	return (
		<Control>
			<Container domRef={toggleElement}>
				{toggle}
			</Container>
			{createPortal(
				<article
					className={cnBase()}
					style={{[`--${cnBase()}_nesting`]: nesting}}
				>
					<Popup
						active={active}
						calculatePosition={calculateRelativePosition}
						renderMode={renderMode}
					>
						{content}
					</Popup>
				</article>,
				frontLayer
			)}
		</Control>
	);
}