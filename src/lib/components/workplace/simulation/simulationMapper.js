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
import { mapWeatherAppRoomToSimulationState } from '../theme/weatherApp/weatherAppMapper';

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
	weatherApp: mapWeatherAppRoomToSimulationState
};

export function mapJsonToSimulationState(themeId, jsonText) {
	const mapper = mapperByThemeId[themeId];

	if (!mapper) {
		return {
			ok: false,
			role: null,
			message: `지원하지 않는 테마입니다: ${themeId}`,
			state: {
				layers: {}
			}
		};
	}

	return mapper(jsonText);
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
