// src/lib/components/workplace/validator/monsterDefenseValidator.js

import { isPlainObject, makeResult, parseJsonWithFriendlyError } from './jsonValidator.js';

import { mapMonsterDefenseFinalJsonToSimulationState } from '../theme/monsterDefense/monsterDefenseMapper.js';

const DIRECTIONS = ['북쪽', '동쪽', '남쪽', '서쪽'];

const MONSTER_NAMES = ['초록괴물', '숲괴물'];
const BODY_COLORS = ['초록'];

const TRAP_TYPES = ['그물트랩', '미끄럼기름', '소리폭탄'];
const CANNON_TYPES = ['불대포', '물대포', '바람대포'];

const WALL_CLUES = ['큰발자국', '작은발자국', '긁힌자국'];
const TRAP_CLUES = ['오래멈춤', '금방풀림', '효과없음'];
const CANNON_CLUES = ['크게약해짐', '효과없음', '금방움직임'];

const WALL_MATERIALS = ['돌', '철문', '잠금장치'];
const TRAP_MATERIALS = ['그물', '고정핀', '작동줄'];
const CANNON_MATERIALS = ['화염석', '발사관', '점화장치'];
const REPORT_TARGETS = ['성벽팀', '트랩팀', '대포팀'];

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

function normalizeChoice(value) {
	return String(value).replaceAll(' ', '').trim();
}

function validateStringPath({ parsed, path, messages, allowedValues = null }) {
	if (!hasPath(parsed, path)) {
		pushMissing(messages, path);
		return '';
	}

	const value = getValueByPath(parsed, path);

	if (typeof value !== 'string') {
		pushTypeError(messages, path, '문자열');
		return '';
	}

	const trimmedValue = value.trim();

	if (!trimmedValue) {
		messages.push({
			type: 'error',
			text: `"${path}" 값은 빈 문자열이면 안 됩니다.`
		});
		return '';
	}

	if (Array.isArray(allowedValues) && allowedValues.length > 0) {
		const normalizedValue = normalizeChoice(value);
		const normalizedAllowedValues = allowedValues.map(normalizeChoice);

		if (!normalizedAllowedValues.includes(normalizedValue)) {
			messages.push({
				type: 'error',
				text: `"${path}" 값은 ${allowedValues.join(', ')} 중에서 입력해야 합니다.`
			});
			return '';
		}
	}

	messages.push({
		type: 'success',
		text: `"${path}" 값이 확인되었습니다.`
	});

	return value;
}

function validateBooleanPath({ parsed, path, messages, expectedValue = null }) {
	if (!hasPath(parsed, path)) {
		pushMissing(messages, path);
		return false;
	}

	const value = getValueByPath(parsed, path);

	if (typeof value !== 'boolean') {
		pushTypeError(messages, path, 'true/false');
		return false;
	}

	if (expectedValue !== null && value !== expectedValue) {
		messages.push({
			type: 'error',
			text: `"${path}" 값은 ${expectedValue}로 입력해야 합니다.`
		});
		return false;
	}

	messages.push({
		type: 'success',
		text: `"${path}" 값이 확인되었습니다.`
	});

	return value;
}

function validateNumberPath({ parsed, path, messages, allowedValues = null }) {
	if (!hasPath(parsed, path)) {
		pushMissing(messages, path);
		return null;
	}

	const value = getValueByPath(parsed, path);

	if (typeof value !== 'number') {
		pushTypeError(messages, path, '숫자');
		return null;
	}

	if (Array.isArray(allowedValues) && allowedValues.length > 0 && !allowedValues.includes(value)) {
		messages.push({
			type: 'error',
			text: `"${path}" 값은 ${allowedValues.join(', ')} 중에서 입력해야 합니다.`
		});
		return null;
	}

	messages.push({
		type: 'success',
		text: `"${path}" 값이 확인되었습니다.`
	});

	return value;
}

function validateArrayPath({ parsed, path, messages, expectedValues = null }) {
	if (!hasPath(parsed, path)) {
		pushMissing(messages, path);
		return [];
	}

	const value = getValueByPath(parsed, path);

	if (!Array.isArray(value)) {
		pushTypeError(messages, path, '배열 [ ]');
		return [];
	}

	if (value.length === 0) {
		messages.push({
			type: 'error',
			text: `"${path}" 배열은 비어 있으면 안 됩니다.`
		});
		return [];
	}

	if (value.some((item) => typeof item !== 'string')) {
		messages.push({
			type: 'error',
			text: `"${path}" 배열 안의 값은 문자열이어야 합니다.`
		});
		return [];
	}

	if (Array.isArray(expectedValues) && expectedValues.length > 0) {
		const normalizedValue = value.map(normalizeChoice);
		const normalizedExpected = expectedValues.map(normalizeChoice);

		const sameLength = normalizedValue.length === normalizedExpected.length;
		const sameOrder = normalizedExpected.every((expected, index) => {
			return normalizedValue[index] === expected;
		});

		if (!sameLength || !sameOrder) {
			messages.push({
				type: 'error',
				text: `"${path}"에 필요한 재료를 모두 넣어 주세요. 필요한 값: ${expectedValues.join(', ')}`
			});
			return [];
		}
	}

	messages.push({
		type: 'success',
		text: `"${path}" 배열이 확인되었습니다.`
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

function isDeepEqual(a, b) {
	if (a === b) return true;

	if (Array.isArray(a) || Array.isArray(b)) {
		if (!Array.isArray(a) || !Array.isArray(b)) return false;
		if (a.length !== b.length) return false;

		return a.every((item, index) => isDeepEqual(item, b[index]));
	}

	if (isPlainObject(a) || isPlainObject(b)) {
		if (!isPlainObject(a) || !isPlainObject(b)) return false;

		const aKeys = Object.keys(a).sort();
		const bKeys = Object.keys(b).sort();

		if (aKeys.length !== bKeys.length) return false;

		return aKeys.every((key, index) => {
			return key === bKeys[index] && isDeepEqual(a[key], b[key]);
		});
	}

	return false;
}

function isFinalPlanCorrect(plan, answerPlan) {
	return isDeepEqual(plan, answerPlan);
}

function validateScoutMission(parsed, roleId) {
	const rootError = validateRootObject(parsed);
	if (rootError) return rootError;

	const messages = [];

	validateObjectPath({
		parsed,
		path: '단서수집',
		messages
	});

	if (roleId === 'wall') {
		validateStringPath({
			parsed,
			path: '단서수집.위험방향',
			messages,
			allowedValues: DIRECTIONS
		});

		validateStringPath({
			parsed,
			path: '단서수집.이유',
			messages
		});

		return makeStructureResult(messages, '성벽팀 단서수집 JSON이 확인되었습니다.');
	}

	if (roleId === 'trap') {
		validateStringPath({
			parsed,
			path: '단서수집.추천트랩',
			messages,
			allowedValues: TRAP_TYPES
		});

		validateStringPath({
			parsed,
			path: '단서수집.이유',
			messages
		});

		return makeStructureResult(messages, '트랩팀 단서수집 JSON이 확인되었습니다.');
	}

	if (roleId === 'attack') {
		validateStringPath({
			parsed,
			path: '단서수집.추천대포',
			messages,
			allowedValues: CANNON_TYPES
		});

		validateStringPath({
			parsed,
			path: '단서수집.이유',
			messages
		});

		return makeStructureResult(messages, '대포팀 단서수집 JSON이 확인되었습니다.');
	}

	if (roleId === 'scout') {
		validateStringPath({
			parsed,
			path: '단서수집.괴물이름',
			messages,
			allowedValues: MONSTER_NAMES
		});

		validateStringPath({
			parsed,
			path: '단서수집.침입방향',
			messages,
			allowedValues: DIRECTIONS
		});

		return makeStructureResult(messages, '정찰팀 단서수집 JSON이 확인되었습니다.');
	}

	return makeResult(false, 'condition', [
		{
			type: 'error',
			text: '현재 역할의 단서수집 미션 정보를 찾을 수 없습니다.'
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

		validateArrayPath({
			parsed,
			path: '방어도구.성벽.재료',
			messages,
			expectedValues: WALL_MATERIALS
		});

		validateNumberPath({
			parsed,
			path: '방어도구.성벽.높이',
			messages,
			allowedValues: [5]
		});

		validateStringPath({
			parsed,
			path: '방어도구.성벽.문상태',
			messages,
			allowedValues: ['닫힘']
		});

		return makeStructureResult(messages, '성벽 설계도 JSON이 확인되었습니다.');
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
			messages,
			allowedValues: ['그물트랩']
		});

		validateArrayPath({
			parsed,
			path: '방어도구.트랩.재료',
			messages,
			expectedValues: TRAP_MATERIALS
		});

		validateStringPath({
			parsed,
			path: '방어도구.트랩.작동방식',
			messages,
			allowedValues: ['당기기']
		});

		return makeStructureResult(messages, '트랩 설계도 JSON이 확인되었습니다.');
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
			messages,
			allowedValues: ['불대포']
		});

		validateArrayPath({
			parsed,
			path: '방어도구.대포.재료',
			messages,
			expectedValues: CANNON_MATERIALS
		});

		validateNumberPath({
			parsed,
			path: '방어도구.대포.발사세기',
			messages,
			allowedValues: [3]
		});

		return makeStructureResult(messages, '대포 설계도 JSON이 확인되었습니다.');
	}

	if (roleId === 'scout') {
		validateObjectPath({
			parsed,
			path: '방어도구.정찰장비',
			messages
		});

		validateStringPath({
			parsed,
			path: '방어도구.정찰장비.장비',
			messages,
			allowedValues: ['무전기']
		});

		validateArrayPath({
			parsed,
			path: '방어도구.정찰장비.보고대상',
			messages,
			expectedValues: REPORT_TARGETS
		});

		validateNumberPath({
			parsed,
			path: '방어도구.정찰장비.경보단계',
			messages,
			allowedValues: [3]
		});

		return makeStructureResult(messages, '정찰 장비 설계도 JSON이 확인되었습니다.');
	}

	return makeResult(false, 'condition', [
		{
			type: 'error',
			text: '현재 역할의 방어 도구 미션 정보를 찾을 수 없습니다.'
		}
	]);
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

	validateObjectPath({
		parsed,
		path: '최종방어작전.목표',
		messages
	});

	validateStringPath({
		parsed,
		path: '최종방어작전.목표.괴물',
		messages,
		allowedValues: ['초록괴물']
	});

	validateStringPath({
		parsed,
		path: '최종방어작전.목표.방향',
		messages,
		allowedValues: ['북쪽']
	});

	validateArrayPath({
		parsed,
		path: '최종방어작전.방어도구',
		messages,
		expectedValues: ['성벽', '그물트랩', '불대포']
	});

	validateBooleanPath({
		parsed,
		path: '최종방어작전.실행',
		messages,
		expectedValue: true
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
