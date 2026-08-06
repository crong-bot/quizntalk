// src/lib/components/workplace/theme/timeMuseum/timeMuseumMapper.js

import { createTimeMuseumInitialState, timeMuseumLayerKeys } from './timeMuseumLayers.js';

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

function getPeriodLayerKey(period) {
	switch (period) {
		case '선사시대':
			return timeMuseumLayerKeys.prehistoryRestored;

		case '삼국시대':
			return timeMuseumLayerKeys.threeKingdomsRestored;

		case '고려시대':
			return timeMuseumLayerKeys.goryeoRestored;

		case '조선시대':
			return timeMuseumLayerKeys.joseonRestored;

		default:
			return null;
	}
}

export function mapTimeMuseumJsonToSimulationState(jsonText = '') {
	try {
		if (!jsonText?.trim()) {
			return {
				ok: true,
				role: null,
				message: '유물정보관리시스템 데이터 변환 준비 완료',

				state: {
					layers: {},
					sprites: {},
					camera: {}
				}
			};
		}

		const data = JSON.parse(jsonText);

		const nextState = {
			layers: {},
			sprites: {},
			camera: {}
		};

		/*
		 * 미션 2에서만 "담당시대"가 존재한다.
		 *
		 * 예:
		 * {
		 *   "담당시대": "선사시대",
		 *   "유물정보": [...]
		 * }
		 */
		const period = String(data?.담당시대 ?? '').trim();

		if (period) {
			const periodLayerKey = getPeriodLayerKey(period);

			if (periodLayerKey) {
				nextState.layers[timeMuseumLayerKeys.systemDiagnosed] = true;

				nextState.layers[periodLayerKey] = true;
			}
		}

		return {
			ok: true,
			role: null,
			message: '유물정보관리시스템 화면 반영 완료',
			state: nextState
		};
	} catch {
		return {
			ok: false,
			role: null,

			message: 'JSON 문법이 올바르지 않아 유물정보관리시스템 화면을 바꿀 수 없습니다.',

			state: {
				layers: {},
				sprites: {},
				camera: {}
			}
		};
	}
}
