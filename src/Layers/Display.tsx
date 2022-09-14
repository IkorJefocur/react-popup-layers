import './Display.sass';
import React, {useRef, useLayoutEffect} from 'react';
import cn from '../cn';

export interface Props {
	setElement: (value: HTMLElement) => void;
}

export default function LayersDisplay({
	setElement
}: Props) {
	const element = useRef<HTMLDivElement>(null);
	useLayoutEffect(() => {
		setElement(element.current as HTMLDivElement);
	}, [setElement]);

	return <section ref={element} className={cn('Layers', 'Display')()} />;
}