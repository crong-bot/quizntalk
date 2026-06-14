// src/lib/components/workplace/theme/timeMuseum/timeMuseumMapper.js

import { createTimeMuseumInitialState } from './timeMuseumLayers.js';

export function mergeTimeMuseumSimulationState(prevState = {}, nextState = {}) {
	return {
		...prevState,
		...nextState,

		layers: {
			...(prevState.layers ?? {}),
			...(nextState.layers ?? {})
		},

		sprites: {
			...(prevState.sprites ?? {}),
			...(nextState.sprites ?? {})
		},

		camera: {
			...(prevState.camera ?? {}),
			...(nextState.camera ?? {})
		}
	};
}

export function mapTimeMuseumRoomToSimulationState(room = {}) {
	const baseState = createTimeMuseumInitialState();

	return mergeTimeMuseumSimulationState(baseState, room?.simulationState ?? {});
}

export function mapTimeMuseumJsonToSimulationState(jsonText = '') {
	const baseState = createTimeMuseumInitialState();

	try {
		if (jsonText?.trim()) {
			JSON.parse(jsonText);
		}

		return {
			ok: true,
			role: null,
			message: '유물정보관리시스템 데이터 변환 준비 완료',
			state: baseState
		};
	} catch {
		return {
			ok: false,
			role: null,
			message: 'JSON 문법이 올바르지 않아 유물정보관리시스템 화면을 바꿀 수 없습니다.',
			state: baseState
		};
	}
}
