// src/lib/components/workplace/theme/monsterDefense/monsterDefenseMapper.js

import { monsterDefenseLayers } from './monsterDefenseLayers.js';

const MONSTER_DIRECTION = '북쪽';

function normalizeJson(value) {
	return JSON.stringify(value);
}

function getFinalPlanFromJsonText(jsonText) {
	try {
		const parsed = JSON.parse(jsonText);
		return parsed?.최종방어작전 ?? null;
	} catch {
		return null;
	}
}

function isFinalPlanCorrect(plan, answerPlan) {
	if (!plan || !answerPlan) return false;
	return normalizeJson(plan) === normalizeJson(answerPlan);
}

function getWallLayerByDirection(direction = '') {
	if (direction.includes('북쪽')) return monsterDefenseLayers.wallNorth;
	if (direction.includes('동쪽')) return monsterDefenseLayers.wallEast;
	if (direction.includes('남쪽')) return monsterDefenseLayers.wallSouth;
	if (direction.includes('서쪽')) return monsterDefenseLayers.wallWest;

	return '';
}

function createBaseLayers() {
	return {
		[monsterDefenseLayers.baseMap]: true,
		[monsterDefenseLayers.city]: true,

		[monsterDefenseLayers.wallNorth]: false,
		[monsterDefenseLayers.wallEast]: false,
		[monsterDefenseLayers.wallSouth]: false,
		[monsterDefenseLayers.wallWest]: false,

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
	};
}

function mapFinalPlanToState({ plan, answerPlan, forcedResult = null }) {
	const hasPlan = Boolean(plan);

	const finalSuccess =
		forcedResult === 'success' ? true : forcedResult === 'fail' ? false : isFinalPlanCorrect(plan, answerPlan);

	const finalFail =
		forcedResult === 'fail' ? true : forcedResult === 'success' ? false : hasPlan && !finalSuccess;

	const monsterName = plan?.괴물이름 ?? '';

	const wallDirection = plan?.성벽?.방향 ?? '';
	const wallDoorClosed = plan?.성벽?.문닫기 === true;

	const trapName = plan?.트랩?.종류 ?? '';
	const trapPosition = plan?.트랩?.설치위치 ?? '';
	const trapActive = plan?.트랩?.작동 === true;

	const cannonType = plan?.대포?.종류 ?? '';
	const cannonActive = plan?.대포?.작동 === true;

	const operationStarted = plan?.작전실행 === true || finalSuccess || finalFail;

	const wallLayer = getWallLayerByDirection(wallDirection);

	const layers = createBaseLayers();

	if (operationStarted && wallDoorClosed && wallLayer) {
		layers[wallLayer] = true;
	}

	if (operationStarted && trapActive && trapName) {
		layers[monsterDefenseLayers.trap] = true;
	}

	if (operationStarted && cannonActive && cannonType) {
		layers[monsterDefenseLayers.waterCannon] = true;
	}

	return {
		layers,

		sprites: {},

		camera: {
			shake: finalFail,
			shakeAmount: finalFail ? 5 : 0,
			shakeSpeed: 1.2
		},

		flags: {
			finalStarted: operationStarted,
			finalSuccess,
			finalFail,

			// 괴물은 항상 북쪽에서 등장
			monsterDirection: MONSTER_DIRECTION,
			monsterName,

			// 성벽은 방향별 이미지
			wallDirection,
			wallDoorClosed,

			// 트랩은 공통 이미지지만, 위치 판단은 flags로 함
			trapName,
			trapPosition,
			trapActive,

			// 물대포도 공통 이미지
			cannonType,
			cannonActive
		}
	};
}

export function mapMonsterDefenseFinalJsonToSimulationState({ jsonText, answerPlan }) {
	const plan = getFinalPlanFromJsonText(jsonText);

	return mapFinalPlanToState({
		plan,
		answerPlan
	});
}

export function mapMonsterDefenseRoomToSimulationState(room) {
	const themeResult = room?.themeResult ?? null;
	const finalPlan = room?.themeState?.defenseSetup?.finalDefensePlan ?? null;
	const answerPlan = room?.themeState?.monsterTruth?.finalDefensePlan ?? null;

	const forcedResult =
		themeResult?.status === 'success' ? 'success' : themeResult?.status === 'fail' ? 'fail' : null;

	return mapFinalPlanToState({
		plan: finalPlan,
		answerPlan,
		forcedResult
	});
}