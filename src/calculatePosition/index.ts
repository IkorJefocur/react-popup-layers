import {CalculatePosition} from '../Layers/Popup';

export type Side = 'top' | 'right' | 'bottom' | 'left';

export const opposites: Record<Side, Side> =
	{top: 'bottom', right: 'left', bottom: 'top', left: 'right'};

export function cornerDistance(side: Side, value: number): number {
	return side === 'right' || side === 'bottom' ? 1 - value : value;
}

export function near(
	priority: Side[] = ['right', 'left', 'bottom', 'top'],
	strictOffset = false
): CalculatePosition {
	const offset = strictOffset ? 'offsetStrict' : 'offset';

	return toggle => {
		const {top, right, left, bottom, width, height} = toggle;

		const distances = Object.fromEntries(priority.map(pos =>
			[pos, cornerDistance(pos, toggle[pos])]
		));
		const side = priority
			.reduce((max, pos) => distances[pos] > distances[max] ? pos : max);
		const vertical = side === 'top' || side === 'bottom';

		return {
			[vertical ? 'verticalPosition' : 'horizontalPosition']: offset,
			[opposites[side]]: cornerDistance(opposites[side], toggle[side]),
			[vertical ? 'horizontalPosition' : 'verticalPosition']: 'center',
			[vertical ? 'left' : 'top']:
				(vertical ? left : top) + (vertical ? width : height) / 2
		};
	};
}