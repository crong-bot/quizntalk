// src/lib/components/workplace/theme/animalRescue/animalRescueTheme.js

import { animalRescueLayers } from './animalRescueLayers.js';

export const animalRescueTheme = {
	id: 'animalRescue',
	title: '늑구 추적 작전',
	width: 1411,
	height: 1115,
	backgroundColor: '#0f172a',

	assets: [
		{
			key: animalRescueLayers.baseMap,
			src: '/images/themes/animal/base.png',
			type: 'base',
			x: 0,
			y: 0,
			width: 1411,
			height: 1115
		}
	]
};
