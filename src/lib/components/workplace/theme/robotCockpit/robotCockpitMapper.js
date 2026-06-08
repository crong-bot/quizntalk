// src/lib/components/workplace/theme/robotCockpit/robotCockpitMapper.js

import { robotCockpitLayers } from './robotCockpitLayers.js';

function parseJson(jsonText) {
	try {
		return JSON.parse(jsonText);
	} catch {
		return null;
	}
}
function showCockpitBackground(layers) {
	layers[robotCockpitLayers.outside] = false;
	layers[robotCockpitLayers.baseFar] = true;
	layers[robotCockpitLayers.baseMiddle] = true;
	layers[robotCockpitLayers.baseNear] = true;
}

function createBaseLayers() {
	return {
		[robotCockpitLayers.outside]: true,

		[robotCockpitLayers.baseFar]: false,
		[robotCockpitLayers.baseMiddle]: false,
		[robotCockpitLayers.baseNear]: false,

		[robotCockpitLayers.cockpit]: false,
		[robotCockpitLayers.cockpitHud]: false
	};
}

function createBaseState() {
	return {
		layers: createBaseLayers(),
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

export function mapRobotCockpitJsonToSimulationState({ jsonText, missionId }) {
	const parsed = parseJson(jsonText);
	const state = createBaseState();

	if (!parsed) return state;

	if (missionId === 'enter-cockpit') {
		const entered = parsed?.콕핏입장 === true || parsed?.로봇탑승 === true;

		if (entered) {
			showCockpitBackground(state.layers);

			state.layers[robotCockpitLayers.cockpit] = true;
			state.layers[robotCockpitLayers.cockpitHud] = false;

			state.flags.enteredCockpit = true;
		}

		return state;
	}

	if (missionId === 'power-on') {
		const hudOn = parsed?.HUD전원 === true || parsed?.불켜기 === true;
		const look = parsed?.시선확인 === true || parsed?.좌우확인 === true;

		showCockpitBackground(state.layers);

		state.flags.enteredCockpit = true;

		if (hudOn) {
			state.layers[robotCockpitLayers.cockpit] = true;
			state.layers[robotCockpitLayers.cockpitHud] = true;
			state.flags.hudOn = true;
		} else {
			state.layers[robotCockpitLayers.cockpit] = true;
			state.layers[robotCockpitLayers.cockpitHud] = false;
			state.flags.hudOn = false;
		}

		state.flags.lookSequenceStarted = hudOn && look;
		state.flags.missileStarted = false;

		return state;
	}

	if (missionId === 'fire-missile') {
		const targetLocked = parsed?.목표조준 === true || parsed?.조준 === true;
		const missileStarted = parsed?.미사일발사 === true || parsed?.발사 === true;

		showCockpitBackground(state.layers);

		state.layers[robotCockpitLayers.cockpit] = false;
		state.layers[robotCockpitLayers.cockpitHud] = true;

		state.flags.enteredCockpit = true;
		state.flags.hudOn = true;

		if (targetLocked && missileStarted) {
			state.flags.missileStarted = true;
		}

		return state;
	}

	return state;
}

export function mapRobotCockpitRoomToSimulationState(room) {
	return (
		room?.simulationState ?? {
			layers: createBaseLayers(),
			sprites: {},
			camera: {},
			flags: {
				enteredCockpit: false,
				hudOn: false,
				lookSequenceStarted: false,
				missileStarted: false,
				missileHit: false
			}
		}
	);
}
