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
		[monsterDefenseLayers.fireCannon]: false,
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
		forcedResult === 'success'
			? true
			: forcedResult === 'fail'
			  ? false
			  : isFinalPlanCorrect(plan, answerPlan);

	const finalFail =
		forcedResult === 'fail' ? true : forcedResult === 'success' ? false : hasPlan && !finalSuccess;

	const target = plan?.목표 ?? {};
	const defenseTools = Array.isArray(plan?.방어도구) ? plan.방어도구 : [];

	const monsterName = target?.괴물 ?? '';
	const wallDirection = target?.방향 ?? MONSTER_DIRECTION;

	const operationStarted = plan?.실행 === true || finalSuccess || finalFail;

	const hasWall = defenseTools.includes('성벽');
	const hasTrap = defenseTools.includes('그물트랩');
	const hasFireCannon = defenseTools.includes('불대포');
	const hasWaterCannon = defenseTools.includes('물대포');

	const wallDoorClosed = operationStarted && hasWall;

	const trapName = hasTrap ? '그물트랩' : '';
	const trapPosition = wallDirection;
	const trapActive = operationStarted && hasTrap;

	const cannonType = hasFireCannon ? '불대포' : hasWaterCannon ? '물대포' : '';
	const cannonPosition = wallDirection;
	const cannonActive = operationStarted && Boolean(cannonType);

	const wallLayer = getWallLayerByDirection(wallDirection);

	const layers = createBaseLayers();

	if (operationStarted && wallDoorClosed && wallLayer) {
		layers[wallLayer] = true;
	}

	if (operationStarted && trapActive) {
		layers[monsterDefenseLayers.trap] = true;
	}

	if (operationStarted && cannonActive) {
		if (cannonType === '불대포') {
			layers[monsterDefenseLayers.fireCannon] = true;
		}

		if (cannonType === '물대포') {
			layers[monsterDefenseLayers.waterCannon] = true;
		}
	}

	return {
		layers,

		sprites: {},

		camera: {
			shake: finalFail,
			shakeAmount: finalFail ? 1 : 0,
			shakeSpeed: 1.01
		},

		flags: {
			finalStarted: operationStarted,
			finalSuccess,
			finalFail,

			monsterDirection: MONSTER_DIRECTION,
			monsterName,

			wallDirection,
			wallDoorClosed,

			trapName,
			trapPosition,
			trapActive,

			cannonType,
			cannonPosition,
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
	return (
		room?.simulationState ?? {
			layers: createBaseLayers(),
			sprites: {},
			camera: {},
			flags: {
				finalStarted: false,
				finalSuccess: false,
				finalFail: false,
				monsterDirection: MONSTER_DIRECTION
			}
		}
	);
}
