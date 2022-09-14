import './index.sass';
import React, {useState, ComponentProps, ReactNode} from 'react';
import cn from '../cn';
import Control from './Control';
import Display from './Display';

export interface Props {
	children?: ReactNode;
}

export default function Layers({
	children
}: Props) {
	const [frontLayer, setFrontLayer] = useState<HTMLElement | undefined>();

	return (
		<section className={cn('Layers')()}>
			{frontLayer &&
				<Control root frontLayer={frontLayer}>{children}</Control>
			}
			<Display setElement={setFrontLayer} />
		</section>
	);
}