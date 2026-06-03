// src/lib/components/workplace/theme/monsterDefense/monsterDefenseMapper.js

import { monsterDefenseLayers } from './monsterDefenseLayers.js';

export function mapMonsterDefenseRoomToSimulationState(room) {
	const themeState = room?.themeState ?? {};
	const themeResult = room?.themeResult ?? null;

	const truth = themeState?.monsterTruth ?? {};
	const setup = themeState?.defenseSetup ?? {};

	const finalSuccess = themeResult?.status === 'success';
	const finalFail = themeResult?.status === 'fail';

	return {
		layers: {
			[monsterDefenseLayers.baseMap]: true,
			[monsterDefenseLayers.city]: true,

			// 현재는 방향별 이미지가 없으므로 값이 들어오면 일단 북쪽용 이미지 표시
			[monsterDefenseLayers.wallNorth]: Boolean(setup.shieldDirection),
			[monsterDefenseLayers.trap]: Boolean(setup.trapDirection),
			[monsterDefenseLayers.waterCannon]: Boolean(setup.weapon),

			// 미션3 실행 전에는 몬스터 숨김
			[monsterDefenseLayers.monsterWalk1]: finalSuccess || finalFail,
			[monsterDefenseLayers.monsterWalk2]: false,
			[monsterDefenseLayers.monsterWalk3]: false,
			[monsterDefenseLayers.monsterHit]: false,
			[monsterDefenseLayers.monsterGroggy]: false,

			[monsterDefenseLayers.waterShot]: false,

			[monsterDefenseLayers.effect]: finalSuccess,
			[monsterDefenseLayers.failEffect]: finalFail
		},

		sprites: {},

		camera: {
			shake: finalFail,
			shakeAmount: finalFail ? 5 : 0,
			shakeSpeed: 1.2
		},

		flags: {
			finalSuccess,
			finalFail,

			monsterDirection: truth.direction ?? '북쪽',
			monsterName: truth.monsterName ?? '',
			requiredWeapon: truth.weapon ?? '',

			shieldDirection: setup.shieldDirection ?? '',
			trapDirection: setup.trapDirection ?? '',
			attackWeapon: setup.weapon ?? ''
		}
	};
}
