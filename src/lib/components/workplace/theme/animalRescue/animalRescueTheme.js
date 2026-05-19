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
			src: '/images/animal-rescue/wolf_map_base.png',
			x: 0,
			y: 0,
			width: 1411,
			height: 1115
		},
		{
			key: animalRescueLayers.pathA,
			src: '/images/animal-rescue/path_a.png',
			x: 0,
			y: 0,
			width: 1411,
			height: 1115
		},
		{
			key: animalRescueLayers.pathB,
			src: '/images/animal-rescue/path_b.png',
			x: 0,
			y: 0,
			width: 1411,
			height: 1115
		},
		{
			key: animalRescueLayers.pathC,
			src: '/images/animal-rescue/path_c.png',
			x: 0,
			y: 0,
			width: 1411,
			height: 1115
		},
		{
			key: animalRescueLayers.reportSignal,
			src: '/images/animal-rescue/report_signal.png',
			x: 0,
			y: 0,
			width: 1411,
			height: 1115,
			blendMode: 'add'
		},
		{
			key: animalRescueLayers.traceSignal,
			src: '/images/animal-rescue/trace_signal.png',
			x: 0,
			y: 0,
			width: 1411,
			height: 1115,
			blendMode: 'add'
		},
		{
			key: animalRescueLayers.timeSignal,
			src: '/images/animal-rescue/time_signal.png',
			x: 0,
			y: 0,
			width: 1411,
			height: 1115,
			blendMode: 'add'
		},
		{
			key: animalRescueLayers.safetySignal,
			src: '/images/animal-rescue/safety_signal.png',
			x: 0,
			y: 0,
			width: 1411,
			height: 1115,
			blendMode: 'add'
		},
		{
			key: animalRescueLayers.captureComplete,
			src: '/images/animal-rescue/capture_complete.png',
			x: 0,
			y: 0,
			width: 1411,
			height: 1115,
			blendMode: 'add'
		}
	]
};
