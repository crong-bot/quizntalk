// src/lib/components/workplace/theme/robotCockpit/robotCockpitLayers.js

export const robotCockpitLayers = {
	outside: 'outside',

	baseFar: 'baseFar',
	baseMiddle: 'baseMiddle',
	baseNear: 'baseNear',

	cockpit: 'cockpit',
	cockpitHud: 'cockpitHud'
};

export const robotCockpitRoleSuccessStates = {
	enterCockpit: {
		layers: {}
	},
	powerOn: {
		layers: {}
	},
	fireMissile: {
		layers: {}
	}
};

export const robotCockpitMissionSuccessStates = {
	enterCockpit: {
		layers: {
			[robotCockpitLayers.outside]: false,
			[robotCockpitLayers.baseFar]: true,
			[robotCockpitLayers.baseMiddle]: true,
			[robotCockpitLayers.baseNear]: true,
			[robotCockpitLayers.cockpit]: true,
			[robotCockpitLayers.cockpitHud]: false
		},
		flags: {
			enteredCockpit: true,
			hudOn: false,
			lookSequenceStarted: false,
			missileStarted: false
		}
	},

	powerOn: {
		layers: {
			[robotCockpitLayers.outside]: false,
			[robotCockpitLayers.baseFar]: true,
			[robotCockpitLayers.baseMiddle]: true,
			[robotCockpitLayers.baseNear]: true,
			[robotCockpitLayers.cockpit]: true,
			[robotCockpitLayers.cockpitHud]: true
		},
		flags: {
			enteredCockpit: true,
			hudOn: true,
			lookSequenceStarted: true,
			missileStarted: false
		}
	},

	fireMissile: {
		layers: {
			[robotCockpitLayers.outside]: false,
			[robotCockpitLayers.baseFar]: true,
			[robotCockpitLayers.baseMiddle]: true,
			[robotCockpitLayers.baseNear]: true,
			[robotCockpitLayers.cockpit]: true,
			[robotCockpitLayers.cockpitHud]: true
		},
		flags: {
			enteredCockpit: true,
			hudOn: true,
			lookSequenceStarted: false,
			missileStarted: true
		}
	}
};
export function createRobotCockpitInitialState() {
	return {
		layers: {
			[robotCockpitLayers.outside]: true,

			[robotCockpitLayers.baseFar]: false,
			[robotCockpitLayers.baseMiddle]: false,
			[robotCockpitLayers.baseNear]: false,

			[robotCockpitLayers.cockpit]: false,
			[robotCockpitLayers.cockpitHud]: false
		},

		sprites: {},

		camera: {
			x: 0,
			y: 0,
			zoom: 1,
			shake: false
		},

		flags: {
			enteredCockpit: false,
			hudOn: false,
			lookSequenceStarted: false,
			missileStarted: false,
			missileHit: false
		}
	};
}
