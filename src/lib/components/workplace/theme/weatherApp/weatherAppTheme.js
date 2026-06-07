// src/lib/components/workplace/theme/weatherApp/weatherAppTheme.js

import { weatherAppLayers } from './weatherAppLayers.js';

const THEME_WIDTH = 1411;
const THEME_HEIGHT = 1115;

export const weatherAppTheme = {
	id: 'weatherApp',
	title: '날씨 API 앱 만들기',
	width: THEME_WIDTH,
	height: THEME_HEIGHT,
	backgroundColor: '#0f172a',

	assets: [
		{
			id: weatherAppLayers.phoneMockup,
			src: '/images/themes/weather-app/phone-mockup.png',
			type: 'base',
			x: 280,
			y: 70,
			width: 900,
			height: 1800
		}
	]
};
