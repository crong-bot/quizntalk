// src/lib/components/workplace/theme/bike/bikeRebalanceTheme.js

import { bikeRebalanceLayers } from './bikeRebalanceLayers.js';

export const bikeRebalanceTheme = {
	id: 'bikeRebalance',
	title: '자전거 재배치 작전',
	width: 1411,
	height: 1115,
	backgroundColor: '#0f172a',

	assets: [
		{
			key: bikeRebalanceLayers.baseMap,
			src: '/images/themes/bike/base.png',
			type: 'base',
			x: 0,
			y: 0,
			width: 1411,
			height: 1115
		}
	]
};
