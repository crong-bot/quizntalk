// src/lib/components/workplace/theme/robotCockpit/robotCockpitTheme.js

import { robotCockpitLayers } from './robotCockpitLayers.js';

const THEME_WIDTH = 1411;
const THEME_HEIGHT = 1115;

function centerX(width) {
	return -Math.round((width - THEME_WIDTH) / 2);
}

function bottomY(height) {
	return THEME_HEIGHT - height;
}
const FAR_BG = {
	width: 2000,
	height: 576,
	x: centerX(2000),
	y: 0
};

const MIDDLE_BG = {
	width: 2788,
	height: 828,
	x: centerX(2788),
	y: 245
};

const NEAR_BG = {
	width: 1970,
	height: 380,
	x: centerX(1970),
	y: bottomY(380)
};

const OUTSIDE = {
	width: THEME_WIDTH,
	height: THEME_HEIGHT,
	x: centerX(THEME_WIDTH),
	y: 0
};

const COCKPIT = {
	width: THEME_WIDTH,
	height: THEME_HEIGHT,
	x: centerX(THEME_WIDTH),
	y: 0
};

export const robotCockpitTheme = {
	id: 'robotCockpit',
	title: '거대 로봇 콕핏 작전',
	width: THEME_WIDTH,
	height: THEME_HEIGHT,
	backgroundColor: '#020617',

	assets: [
		{
			id: robotCockpitLayers.outside,
			src: '/images/themes/robot-cockpit/outside.png',
			type: 'base',

			x: OUTSIDE.x,
			y: OUTSIDE.y,
			width: OUTSIDE.width,
			height: OUTSIDE.height
		},
		{
			id: robotCockpitLayers.baseFar,
			src: '/images/themes/robot-cockpit/base3.png',
			type: 'effect',
			layer: true,
			x: FAR_BG.x,
			y: FAR_BG.y,
			width: FAR_BG.width,
			height: FAR_BG.height
		},
		{
			id: robotCockpitLayers.baseMiddle,
			src: '/images/themes/robot-cockpit/base2.png',
			type: 'effect',
			layer: true,
			x: MIDDLE_BG.x,
			y: MIDDLE_BG.y - 100,
			width: MIDDLE_BG.width,
			height: MIDDLE_BG.height
		},
		{
			id: robotCockpitLayers.baseNear,
			src: '/images/themes/robot-cockpit/base1.png',
			type: 'effect',
			layer: true,
			x: NEAR_BG.x,
			y: NEAR_BG.y - 200,
			width: NEAR_BG.width,
			height: NEAR_BG.height
		},

		{
			id: robotCockpitLayers.cockpit,
			src: '/images/themes/robot-cockpit/cock.png',
			type: 'effect',
			layer: true,
			x: COCKPIT.x,
			y: COCKPIT.y,
			width: COCKPIT.width,
			height: COCKPIT.height
		},
		{
			id: robotCockpitLayers.cockpitHud,
			src: '/images/themes/robot-cockpit/cock_hud.png',
			type: 'base',
			layer: true,
			x: COCKPIT.x,
			y: COCKPIT.y,
			width: COCKPIT.width,
			height: COCKPIT.height
		}
	]
};
