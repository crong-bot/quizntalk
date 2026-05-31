// src/lib/components/workplace/theme/disasterSafety/disasterSafetyTheme.js

import { disasterSafetyLayers } from './disasterSafetyLayers.js';

export const disasterSafetyTheme = {
	id: 'disasterSafety',
	title: '재난안전 분석단',
	width: 1411,
	height: 1115,
	backgroundColor: '#0f172a',

	assets: [
		{
			key: disasterSafetyLayers.baseMap,
			src: '/images/themes/disaster/base.png',
			type: 'base',
			x: 0,
			y: 0,
			width: 1411,
			height: 1115
		}
	]
};
