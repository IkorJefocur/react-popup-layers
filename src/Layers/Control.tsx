import './Control.sass';
import React, {
	useRef, useContext, useEffect, useCallback, createContext,
	ReactNode, SyntheticEvent, MouseEventHandler
} from 'react';
import cn from '../cn';

export interface Props {
	children?: ReactNode;
	frontLayer?: HTMLElement;
	root?: boolean;
}

interface BaseContextProps {
	frontLayer?: HTMLElement;
	setCurrentComponent: SetCurrentComponent;
	nesting: number;
}

export interface ContextProps extends BaseContextProps {
	frontLayer: HTMLElement;
}

interface PrivateContextProps extends BaseContextProps {
	children: LayerChildren;
}

type CloseComponent = () => void;

type LayerChildren = Set<CloseComponent>;

type SetCurrentComponent = (close?: CloseComponent) => void;

export default function LayersControl({
	children,
	frontLayer,
	root = false
}: Props) {
	const {
		frontLayer: parentFrontLayer, nesting, children: layerSiblings
	} = useContext(Context);
	if (!frontLayer)
		frontLayer = parentFrontLayer;

	const activeComponent = useRef<CloseComponent>(() => {});
	const layerChildren = useRef<LayerChildren>(new Set()).current;

	const setCurrentComponent: SetCurrentComponent = useCallback((
		close = () => {}
	) => {
		for (const close of layerChildren)
			close();
		activeComponent.current();
		activeComponent.current = close;
	}, [activeComponent, layerChildren]);

	const closeComponentOnInteract: MouseEventHandler = useCallback(event => {
		if (!preventedCloseEvents.has(event))
			setCurrentComponent();
		preventedCloseEvents.add(event);
	}, [setCurrentComponent]);

	useEffect(() => {
		const close = () => activeComponent.current();
		layerSiblings.add(close);
		return () => {
			layerSiblings.delete(close);
		};
	}, [layerSiblings]);

	return (
		<Context.Provider value={{
			frontLayer, setCurrentComponent,
			nesting: nesting + 1,
			children: layerChildren
		}}>
			<div
				className={cn('Layers', 'Control')({root})}
				onClick={closeComponentOnInteract}
			>
				{children}
			</div>
		</Context.Provider>
	);
}

export function useLayersControlContext(): ContextProps {
	const {frontLayer, setCurrentComponent, nesting} = useContext(Context);
	if (!frontLayer)
		throw new Error('Layers Control context is not set');
	return {frontLayer, setCurrentComponent, nesting};
}

const Context = createContext<PrivateContextProps>({
	frontLayer: undefined,
	setCurrentComponent: () => {},
	nesting: 0,
	children: new Set()
});
Context.displayName = 'LayersControlContext';

const preventedCloseEvents: WeakSet<SyntheticEvent> = new WeakSet();