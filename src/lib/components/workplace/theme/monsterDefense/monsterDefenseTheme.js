// src/lib/components/workplace/theme/monsterDefense/monsterDefenseTheme.js

import { monsterDefenseLayers } from './monsterDefenseLayers.js';

export const monsterDefenseTheme = {
	id: 'monsterDefense',
	title: '괴물 도시 방어 작전',
	width: 1411,
	height: 1115,
	backgroundColor: '#111827',

	assets: [
		{
			id: monsterDefenseLayers.baseMap,
			src: '/images/themes/monster-defense/base.png',
			type: 'base',
			x: 0,
			y: 0,
			width: 1411,
			height: 1115
		},
		{
			id: monsterDefenseLayers.trap,
			src: '/images/themes/monster-defense/trap.png',
			type: 'effect',
			layer: true,
			x: 600,
			y: 135,
			width: 250,
			height: 235
		},
		{
			id: monsterDefenseLayers.monsterWalk1,
			src: '/images/themes/monster-defense/monster-walk-1.png',
			type: 'effect',
			layer: true,
			x: 635,
			y: 90,
			width: 280,
			height: 280
		},
		{
			id: monsterDefenseLayers.monsterWalk2,
			src: '/images/themes/monster-defense/monster-walk-2.png',
			type: 'effect',
			layer: true,
			x: 635,
			y: 90,
			width: 280,
			height: 280
		},
		{
			id: monsterDefenseLayers.monsterWalk3,
			src: '/images/themes/monster-defense/monster-walk-3.png',
			type: 'effect',
			layer: true,
			x: 635,
			y: 90,
			width: 280,
			height: 280
		},

		{
			id: monsterDefenseLayers.monsterHit,
			src: '/images/themes/monster-defense/monster-hit.png',
			type: 'effect',
			layer: true,
			x: 635,
			y: 90,
			width: 240,
			height: 240
		},
		{
			id: monsterDefenseLayers.monsterGroggy,
			src: '/images/themes/monster-defense/monster-groggy.png',
			type: 'effect',
			layer: true,
			x: 635,
			y: 90,
			width: 240,
			height: 240
		},

		{
			id: monsterDefenseLayers.wallNorth,
			src: '/images/themes/monster-defense/wall-north.png',
			type: 'effect',
			layer: true,
			x: 455,
			y: 275,
			width: 520,
			height: 325
		},

		{
			id: monsterDefenseLayers.city,
			src: '/images/themes/monster-defense/city.png',
			type: 'base',
			x: 380,
			y: 270,
			width: 660,
			height: 680
		},

		{
			id: monsterDefenseLayers.waterCannon,
			src: '/images/themes/monster-defense/water-cannon.png',
			type: 'effect',
			layer: true,
			x: 905,
			y: 400,
			width: 275,
			height: 245
		},

		// {
		// 	id: monsterDefenseLayers.waterShot,
		// 	src: '/images/themes/monster-defense/water-shot.png',
		// 	type: 'effect',
		// 	layer: true,
		// 	x: 790,
		// 	y: 480,
		// 	width: 320,
		// 	height: 120,
		// 	anchor: 0.5,
		// 	flipX: true,
		// 	rotation: -0.45
		// },
		{
			id: monsterDefenseLayers.waterShot,
			src: '/images/themes/monster-defense/fireball.png',
			type: 'effect',
			layer: true,
			x: 0,
			y: 0,
			width: 90,
			height: 90,
			anchor: 0.5
		}

		// 성공 이펙트 이미지가 준비되면 다시 추가
		// {
		// 	id: monsterDefenseLayers.effect,
		// 	src: '/images/themes/monster-defense/success-effect.png',
		// 	type: 'effect',
		// 	layer: true,
		// 	x: 505,
		// 	y: 245,
		// 	width: 420,
		// 	height: 260
		// }
	]
};
