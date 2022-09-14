import React from 'react';
import {createRoot} from 'react-dom/client';
import {Layers, Popup, calculatePosition} from '..';

document.addEventListener('DOMContentLoaded', () => {
	const rootElement = document.createElement('div');
	Object.assign(rootElement.style, {
		display: 'grid',
		placeContent: 'stretch',
		height: 'calc(100vh - 100px)',
		backgroundColor: '#FFFFFF'
	});

	createRoot(rootElement).render(
		<Layers>
			<section style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				padding: new Array(4).fill(undefined)
					.map(() => `${Math.random() * 50}px`).join(' ')
			}}>
				<Popup
					renderMode="afterFirstActivate"
					calculatePosition={
						calculatePosition.near(['bottom', 'top'], true)
					}
				>
					{(active, activate) => ({
						toggle:
							<button
								style={{
									width: '200px',
									height: '60px'
								}}
								onClick={activate}
							>
								Toggle popup
							</button>,
						content:
							<div style={{
								display: active ? undefined : 'none',
								boxSizing: 'border-box',
								maxWidth: '100%',
								maxHeight: 'calc(100% - 10px)',
								padding: '50px 100px',
								marginTop: '10px',
								boxShadow: '0 0 10px 0 #555555',
								backgroundColor: '#FFFFFFAA'
							}}>
								Popup
							</div>
					})}
				</Popup>
			</section>
		</Layers>
	);

	Object.assign(document.body.style, {
		padding: '50px',
		margin: '0',
		backgroundColor: '#DDDDDD'
	});
	document.body.append(rootElement);
});