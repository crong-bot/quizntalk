// src/lib/components/workplace/validator/monsterDefenseValidator.js

import {
	isPlainObject,
	makeResult,
	parseJsonWithFriendlyError
} from './jsonValidator.js';

import { mapMonsterDefenseFinalJsonToSimulationState } from '../theme/monsterDefense/monsterDefenseMapper.js';

function getValueByPath(obj, path) {
	return path.split('.').reduce((current, key) => current?.[key], obj);
}

function hasPath(obj, path) {
	const keys = path.split('.');
	let current = obj;

	for (const key of keys) {
		if (!isPlainObject(current) || !(key in current)) {
			return false;
		}

		current = current[key];
	}

	return true;
}

function pushMissing(messages, path) {
	messages.push({
		type: 'error',
		text: `"${path}" 값이 없습니다.`
	});
}

function pushTypeError(messages, path, expectedTypeLabel) {
	messages.push({
		type: 'error',
		text: `"${path}" 값은 ${expectedTypeLabel}로 입력해야 합니다.`
	});
}

function validateRootObject(parsed) {
	if (!isPlainObject(parsed)) {
		return makeResult(false, 'condition', [
			{
				type: 'error',
				text: 'JSON은 { }로 감싼 객체 형태여야 합니다.'
			}
		]);
	}

	return null;
}

function validateObjectPath({ parsed, path, messages }) {
	if (!hasPath(parsed, path)) {
		pushMissing(messages, path);
		return false;
	}

	const value = getValueByPath(parsed, path);

	if (!isPlainObject(value)) {
		messages.push({
			type: 'error',
			text: `"${path}" 값은 { } 객체 형태여야 합니다.`
		});
		return false;
	}

	messages.push({
		type: 'success',
		text: `"${path}" 객체가 확인되었습니다.`
	});

	return true;
}

function validateStringPath({ parsed, path, messages }) {
	if (!hasPath(parsed, path)) {
		pushMissing(messages, path);
		return '';
	}

	const value = getValueByPath(parsed, path);

	if (typeof value !== 'string') {
		pushTypeError(messages, path, '문자열');
		return '';
	}

	if (!value.trim()) {
		messages.push({
			type: 'error',
			text: `"${path}" 값은 빈 문자열이면 안 됩니다.`
		});
		return '';
	}

	messages.push({
		type: 'success',
		text: `"${path}" 값이 확인되었습니다.`
	});

	return value;
}

function validateBooleanPath({ parsed, path, messages }) {
	if (!hasPath(parsed, path)) {
		pushMissing(messages, path);
		return false;
	}

	const value = getValueByPath(parsed, path);

	if (typeof value !== 'boolean') {
		pushTypeError(messages, path, 'true/false');
		return false;
	}

	messages.push({
		type: 'success',
		text: `"${path}" 값이 확인되었습니다.`
	});

	return value;
}

function isOk(messages) {
	return messages.length > 0 && messages.every((message) => message.type === 'success');
}

function makeStructureResult(messages, successText = 'JSON 구조가 확인되었습니다.') {
	const ok = isOk(messages);

	if (!ok) {
		return makeResult(false, 'condition', messages);
	}

	return makeResult(true, 'success', [
		{
			type: 'success',
			text: successText
		}
	]);
}

function validateScoutMission(parsed, roleId) {
	const rootError = validateRootObject(parsed);
	if (rootError) return rootError;

	const messages = [];

	validateObjectPath({
		parsed,
		path: '정찰',
		messages
	});

	if (roleId === 'wall') {
		validateStringPath({
			parsed,
			path: '정찰.예상방향',
			messages
		});

		validateStringPath({
			parsed,
			path: '정찰.근거단서',
			messages
		});

		return makeStructureResult(messages, '정찰 기록 JSON이 확인되었습니다.');
	}

	if (roleId === 'scout') {
		validateStringPath({
			parsed,
			path: '정찰.괴물이름',
			messages
		});

		validateStringPath({
			parsed,
			path: '정찰.침입방향',
			messages
		});

		validateStringPath({
			parsed,
			path: '정찰.몸색',
			messages
		});

		return makeStructureResult(messages, '정찰 기록 JSON이 확인되었습니다.');
	}

	if (roleId === 'trap') {
		validateStringPath({
			parsed,
			path: '정찰.트랩종류',
			messages
		});

		validateStringPath({
			parsed,
			path: '정찰.효과',
			messages
		});

		return makeStructureResult(messages, '트랩 정찰 JSON이 확인되었습니다.');
	}

	if (roleId === 'attack') {
		validateStringPath({
			parsed,
			path: '정찰.대포종류',
			messages
		});

		validateStringPath({
			parsed,
			path: '정찰.효과',
			messages
		});

		return makeStructureResult(messages, '대포 정찰 JSON이 확인되었습니다.');
	}

	return makeResult(false, 'condition', [
		{
			type: 'error',
			text: '현재 역할의 정찰 미션 정보를 찾을 수 없습니다.'
		}
	]);
}

function validatePrepareToolsMission(parsed, roleId) {
	const rootError = validateRootObject(parsed);
	if (rootError) return rootError;

	const messages = [];

	validateObjectPath({
		parsed,
		path: '방어도구',
		messages
	});

	if (roleId === 'wall') {
		validateObjectPath({
			parsed,
			path: '방어도구.성벽',
			messages
		});

		validateStringPath({
			parsed,
			path: '방어도구.성벽.방향',
			messages
		});

		validateBooleanPath({
			parsed,
			path: '방어도구.성벽.문닫기',
			messages
		});

		return makeStructureResult(messages, '성벽 도구 JSON이 확인되었습니다.');
	}

	if (roleId === 'scout') {
		validateStringPath({
			parsed,
			path: '방어도구.괴물이름',
			messages
		});

		validateStringPath({
			parsed,
			path: '방어도구.침입방향',
			messages
		});

		return makeStructureResult(messages, '괴물 정보 JSON이 확인되었습니다.');
	}

	if (roleId === 'trap') {
		validateObjectPath({
			parsed,
			path: '방어도구.트랩',
			messages
		});

		validateStringPath({
			parsed,
			path: '방어도구.트랩.종류',
			messages
		});

		validateStringPath({
			parsed,
			path: '방어도구.트랩.설치위치',
			messages
		});

		validateBooleanPath({
			parsed,
			path: '방어도구.트랩.작동',
			messages
		});

		return makeStructureResult(messages, '트랩 도구 JSON이 확인되었습니다.');
	}

	if (roleId === 'attack') {
		validateObjectPath({
			parsed,
			path: '방어도구.대포',
			messages
		});

		validateStringPath({
			parsed,
			path: '방어도구.대포.종류',
			messages
		});

		validateBooleanPath({
			parsed,
			path: '방어도구.대포.작동',
			messages
		});

		return makeStructureResult(messages, '대포 도구 JSON이 확인되었습니다.');
	}

	return makeResult(false, 'condition', [
		{
			type: 'error',
			text: '현재 역할의 방어 도구 미션 정보를 찾을 수 없습니다.'
		}
	]);
}

function isFinalPlanCorrect(plan, answerPlan) {
	return JSON.stringify(plan) === JSON.stringify(answerPlan);
}

function validateFinalDefenseMission({ parsed, jsonText, mission }) {
	const rootError = validateRootObject(parsed);
	if (rootError) return rootError;

	const messages = [];

	validateObjectPath({
		parsed,
		path: '최종방어작전',
		messages
	});

	validateStringPath({
		parsed,
		path: '최종방어작전.괴물이름',
		messages
	});

	validateObjectPath({
		parsed,
		path: '최종방어작전.성벽',
		messages
	});

	validateStringPath({
		parsed,
		path: '최종방어작전.성벽.방향',
		messages
	});

	validateBooleanPath({
		parsed,
		path: '최종방어작전.성벽.문닫기',
		messages
	});

	validateObjectPath({
		parsed,
		path: '최종방어작전.트랩',
		messages
	});

	validateStringPath({
		parsed,
		path: '최종방어작전.트랩.종류',
		messages
	});

	validateStringPath({
		parsed,
		path: '최종방어작전.트랩.설치위치',
		messages
	});

	validateBooleanPath({
		parsed,
		path: '최종방어작전.트랩.작동',
		messages
	});

	validateObjectPath({
		parsed,
		path: '최종방어작전.대포',
		messages
	});

	validateStringPath({
		parsed,
		path: '최종방어작전.대포.종류',
		messages
	});

	validateBooleanPath({
		parsed,
		path: '최종방어작전.대포.작동',
		messages
	});

	validateBooleanPath({
		parsed,
		path: '최종방어작전.작전실행',
		messages
	});

	if (!isOk(messages)) {
		return makeResult(false, 'condition', messages);
	}

	const submittedPlan = parsed.최종방어작전;
	const answerPlan = mission?.finalAnswer?.최종방어작전 ?? null;
	const finalCorrect = isFinalPlanCorrect(submittedPlan, answerPlan);

	const simulationState = mapMonsterDefenseFinalJsonToSimulationState({
		jsonText,
		answerPlan
	});

	return makeResult(
		true,
		'success',
		[
			{
				type: finalCorrect ? 'success' : 'warning',
				text: finalCorrect
					? '방어 계획이 정확합니다. 방어를 실행합니다.'
					: '방어 계획이 실행되었습니다. 결과를 공용화면에서 확인하세요.'
			}
		],
		{
			finalCorrect,
			simulationState,
			finalPiece: {
				key: '최종방어작전',
				value: submittedPlan
			}
		}
	);
}

export function validateMonsterDefenseMissionJson({ jsonText, course, missionIndex, roleId }) {
	const parsedResult = parseJsonWithFriendlyError(jsonText);

	if (!parsedResult.ok) {
		return makeResult(false, 'syntax', [
			{
				type: 'error',
				text: parsedResult.message
			}
		]);
	}

	const mission = course?.missions?.[missionIndex];

	if (!mission) {
		return makeResult(false, 'condition', [
			{
				type: 'error',
				text: '현재 미션 정보를 찾을 수 없습니다.'
			}
		]);
	}

	if (mission.id === 'scout') {
		return validateScoutMission(parsedResult.data, roleId);
	}

	if (mission.id === 'prepare-tools') {
		return validatePrepareToolsMission(parsedResult.data, roleId);
	}

	if (mission.id === 'final-defense' || mission.type === 'team-final') {
		return validateFinalDefenseMission({
			parsed: parsedResult.data,
			jsonText,
			mission
		});
	}

	return makeResult(false, 'condition', [
		{
			type: 'error',
			text: '몬스터 디펜스 미션 검증 정보를 찾을 수 없습니다.'
		}
	]);
}