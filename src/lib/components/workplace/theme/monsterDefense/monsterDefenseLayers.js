// src/lib/components/workplace/theme/monsterDefense/monsterDefenseLayers.js

export const monsterDefenseLayers = {
	baseMap: 'baseMap',
	city: 'city',

	wallNorth: 'wallNorth',
	trap: 'trap',
	waterCannon: 'waterCannon',
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
			[monsterDefenseLayers.trap]: false,
			[monsterDefenseLayers.waterCannon]: false,
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
		camera: {},
		flags: {
			finalSuccess: false,
			finalFail: false
		}
	};
}
