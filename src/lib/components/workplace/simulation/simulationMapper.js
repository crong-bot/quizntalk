// C:\quizntalk\src\lib\components\workplace\simulation\simulationMapper.js
import { mapAnimalRescueRoomToSimulationState } from '../theme/animalRescue/animalRescueMapper';
import { mapBikeRebalanceRoomToSimulationState } from '../theme/bike/bikeRebalanceMapper';
import { mapDisasterSafetyRoomToSimulationState } from '../theme/disasterSafety/disasterSafetyMapper';
import { mapHackerTraceJsonToSimulationState } from '../theme/hackerTrace/hackerTraceMapper';
import { mapMarketBasketJsonToSimulationState } from '../theme/market/marketBasketMapper';
import { mapMonsterDefenseRoomToSimulationState } from '../theme/monsterDefense/monsterDefenseMapper';
import { mapOwlBusRoomToSimulationState } from '../theme/owlBus/owlBusMapper';
import { mapSpaceBaseJsonToSimulationState } from '../theme/spaceBase/spaceBaseMapper';

const mapperByThemeId = {
	spaceBase: mapSpaceBaseJsonToSimulationState,
	animalRescue: mapAnimalRescueRoomToSimulationState,
	hackerTrace: mapHackerTraceJsonToSimulationState,
	marketBasket: mapMarketBasketJsonToSimulationState,
	bikeRebalance: mapBikeRebalanceRoomToSimulationState,
	disasterSafety: mapDisasterSafetyRoomToSimulationState,
	owlBus: mapOwlBusRoomToSimulationState,
	monsterDefense: mapMonsterDefenseRoomToSimulationState
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
		layers: {
			...(prev?.layers ?? {}),
			...(patch?.layers ?? {})
		}
	};
}
