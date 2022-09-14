import './Content.sass';
import React, {ReactNode, ComponentProps} from 'react';
import cn from '../cn';

export type DOMProps = ComponentProps<'section'>;

export interface Props extends DOMProps {
	children?: ReactNode;
}

export default function PopupContent({
	children,
	className,
	...domProps
}: Props) {
	return (
		<section
			className={cn('Popup', 'Content')({}, [className])}
			{...domProps}
		>
			{children}
		</section>
	);
}