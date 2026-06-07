// src/lib/components/workplace/theme/monsterDefense/monsterDefenseLayers.js

export const monsterDefenseLayers = {
	baseMap: 'baseMap',
	city: 'city',

	// 성벽만 방향별 이미지 사용
	wallNorth: 'wallNorth',
	wallEast: 'wallEast',
	wallSouth: 'wallSouth',
	wallWest: 'wallWest',

	// 트랩/물대포/물줄기는 공통 이미지 사용
	trap: 'trap',
	waterCannon: 'waterCannon',
	fireCannon: 'fireCannon',
	waterShot: 'waterShot',

	monsterWalk1: 'monsterWalk1',
	monsterWalk2: 'monsterWalk2',
	monsterWalk3: 'monsterWalk3',
	monsterHit: 'monsterHit',
	monsterGroggy: 'monsterGroggy',

	effect: 'effect',
	failEffect: 'failEffect'
};

export const monsterDefenseRoleSuccessStates = {
	scout: {
		layers: {}
	},
	wall: {
		layers: {}
	},
	trap: {
		layers: {}
	},
	attack: {
		layers: {}
	}
};

export const monsterDefenseMissionSuccessStates = {
	scout: {
		layers: {}
	},
	prepare: {
		layers: {}
	},
	finalDefense: {
		layers: {}
	}
};

export function createMonsterDefenseInitialState() {
	return {
		layers: {
			[monsterDefenseLayers.baseMap]: true,
			[monsterDefenseLayers.city]: true,

			[monsterDefenseLayers.wallNorth]: false,
			[monsterDefenseLayers.wallEast]: false,
			[monsterDefenseLayers.wallSouth]: false,
			[monsterDefenseLayers.wallWest]: false,

			[monsterDefenseLayers.trap]: false,
			[monsterDefenseLayers.waterCannon]: false,
			[monsterDefenseLayers.fireCannon]: false,
			[monsterDefenseLayers.waterShot]: false,

			[monsterDefenseLayers.monsterWalk1]: false,
			[monsterDefenseLayers.monsterWalk2]: false,
			[monsterDefenseLayers.monsterWalk3]: false,
			[monsterDefenseLayers.monsterHit]: false,
			[monsterDefenseLayers.monsterGroggy]: false,

			[monsterDefenseLayers.effect]: false,
			[monsterDefenseLayers.failEffect]: false
		},

		sprites: {},

		camera: {
			shake: false,
			shakeAmount: 0,
			shakeSpeed: 1.2
		},

		flags: {
			finalStarted: false,
			finalSuccess: false,
			finalFail: false,

			monsterDirection: '북쪽',
			monsterName: '',

			wallDirection: '',
			wallDoorClosed: false,

			trapName: '',
			trapPosition: '',
			trapActive: false,

			cannonType: '',
			cannonActive: false
		}
	};
}
