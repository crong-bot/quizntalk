// C:\quizntalk\src\lib\components\workplace\simulation\simulationMapper.js
import { mapAnimalRescueRoomToSimulationState } from '../theme/animalRescue/animalRescueMapper';
import { mapBikeRebalanceRoomToSimulationState } from '../theme/bike/bikeRebalanceMapper';
import { mapDisasterSafetyRoomToSimulationState } from '../theme/disasterSafety/disasterSafetyMapper';
import { mapHackerTraceJsonToSimulationState } from '../theme/hackerTrace/hackerTraceMapper';
import { mapMarketBasketJsonToSimulationState } from '../theme/market/marketBasketMapper';
import { mapMonsterDefenseRoomToSimulationState } from '../theme/monsterDefense/monsterDefenseMapper';
import { mapOwlBusRoomToSimulationState } from '../theme/owlBus/owlBusMapper';
import { mapRobotCockpitJsonToSimulationState } from '../theme/robotCockpit/robotCockpitMapper';
import { mapSpaceBaseJsonToSimulationState } from '../theme/spaceBase/spaceBaseMapper';
import { mapTimeMuseumJsonToSimulationState } from '../theme/timeMuseum/timeMuseumMapper';
import { mapWeatherAppJsonToSimulationState } from '../theme/weatherApp/weatherAppMapper';

const mapperByThemeId = {
	spaceBase: mapSpaceBaseJsonToSimulationState,
	animalRescue: mapAnimalRescueRoomToSimulationState,
	hackerTrace: mapHackerTraceJsonToSimulationState,
	marketBasket: mapMarketBasketJsonToSimulationState,
	bikeRebalance: mapBikeRebalanceRoomToSimulationState,
	disasterSafety: mapDisasterSafetyRoomToSimulationState,
	owlBus: mapOwlBusRoomToSimulationState,
	monsterDefense: mapMonsterDefenseRoomToSimulationState,
	robotCockpit: mapRobotCockpitJsonToSimulationState,
	weatherApp: mapWeatherAppJsonToSimulationState,
	timeMuseum: mapTimeMuseumJsonToSimulationState
};

export function mapJsonToSimulationState(themeId, input) {
	const mapper = mapperByThemeId[themeId];

	if (!mapper) {
		return {
			ok: false,
			role: null,
			message: `지원하지 않는 테마입니다: ${themeId}`,
			state: {
				layers: {},
				sprites: {},
				camera: {},
				flags: {}
			}
		};
	}

	const result = mapper(input);

	// 이미 { ok, state } 형태로 반환하는 mapper는 그대로 사용
	if (result && typeof result === 'object' && 'ok' in result) {
		return result;
	}

	// weatherApp처럼 state 객체만 반환하는 mapper를 표준 형태로 감싸기
	if (result && typeof result === 'object') {
		return {
			ok: true,
			state: {
				layers: result.layers ?? {},
				sprites: result.sprites ?? {},
				camera: result.camera ?? {},
				flags: result.flags ?? {}
			}
		};
	}

	return {
		ok: false,
		role: null,
		message: '시뮬레이션 상태로 변환하지 못했습니다.',
		state: {
			layers: {},
			sprites: {},
			camera: {},
			flags: {}
		}
	};
}

export function mergeSimulationState(prev, patch) {
	return {
		...prev,
		...patch,

		layers: {
			...(prev?.layers ?? {}),
			...(patch?.layers ?? {})
		},

		sprites: {
			...(prev?.sprites ?? {}),
			...(patch?.sprites ?? {})
		},

		camera: {
			...(prev?.camera ?? {}),
			...(patch?.camera ?? {})
		},

		flags: {
			...(prev?.flags ?? {}),
			...(patch?.flags ?? {})
		}
	};
}
