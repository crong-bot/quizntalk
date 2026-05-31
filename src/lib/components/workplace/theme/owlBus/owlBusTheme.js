// src/lib/components/workplace/theme/owlBus/owlBusTheme.js

import { owlBusLayers } from './owlBusLayers.js';

export const owlBusTheme = {
	id: 'owlBus',
	title: '올빼미버스 기획단',
	width: 1411,
	height: 1115,
	backgroundColor: '#0f172a',

	assets: [
		{
			key: owlBusLayers.baseMap,
			src: '/images/themes/owl-bus/base.png',
			type: 'base',
			x: 0,
			y: 0,
			width: 1411,
			height: 1115
		}
	]
};
