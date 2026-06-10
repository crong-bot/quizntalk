// src/lib/components/workplace/theme/robotCockpit/robotCockpitMapper.js

import { robotCockpitLayers } from './robotCockpitLayers.js';

function parseJson(jsonText) {
	try {
		return JSON.parse(jsonText);
	} catch {
		return null;
	}
}

function isSameArray(a, b) {
	if (!Array.isArray(a) || !Array.isArray(b)) return false;
	if (a.length !== b.length) return false;

	return a.every((item, index) => item === b[index]);
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
		const entered = parsed?.파일럿아이디 === '25KE-415' && parsed?.코드 === 31735;

		if (entered) {
			showCockpitBackground(state.layers);

			state.layers[robotCockpitLayers.cockpit] = true;
			state.layers[robotCockpitLayers.cockpitHud] = false;

			state.flags.enteredCockpit = true;
			state.flags.hudOn = false;
			state.flags.lookSequenceStarted = false;
			state.flags.missileStarted = false;
		}

		return state;
	}

	if (missionId === 'power-on') {
		const hudOn = parsed?.HUD전원 === true;

		const look = isSameArray(parsed?.시선확인, [
			'오른쪽',
			'가운데',
			'왼쪽',
			'가운데'
		]);

		const move = isSameArray(parsed?.이동, [
			'앞',
			'원위치',
			'뒤',
			'원위치'
		]);

		const powerOnComplete = hudOn && look && move;

		showCockpitBackground(state.layers);

		state.layers[robotCockpitLayers.cockpit] = true;
		state.layers[robotCockpitLayers.cockpitHud] = hudOn;

		state.flags.enteredCockpit = true;
		state.flags.hudOn = hudOn;
		state.flags.lookSequenceStarted = powerOnComplete;
		state.flags.missileStarted = false;
		state.flags.missileHit = false;

		return state;
	}

	if (missionId === 'fire-missile') {
		const fireSuccess =
			parsed?.공격실행?.목표 === '붉은타워' &&
			parsed?.공격실행?.좌표 === 'B7' &&
			parsed?.공격실행?.무기 === '미사일' &&
			parsed?.공격실행?.발사각도 === 24;

		showCockpitBackground(state.layers);

		state.layers[robotCockpitLayers.cockpit] = false;
		state.layers[robotCockpitLayers.cockpitHud] = true;

		state.flags.enteredCockpit = true;
		state.flags.hudOn = true;
		state.flags.lookSequenceStarted = false;
		state.flags.missileStarted = fireSuccess;
		state.flags.missileHit = false;

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