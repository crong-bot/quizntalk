// src/lib/components/workplace/validator/weatherAppValidator.js

import { mapWeatherAppJsonToSimulationState } from '../theme/weatherApp/weatherAppMapper.js';
import { isPlainObject, makeResult, parseJsonWithFriendlyError } from './jsonValidator.js';

function isIndexKey(key) {
	return /^\d+$/.test(key);
}

function canAccessKey(current, key) {
	if (Array.isArray(current)) {
		const index = Number(key);
		return isIndexKey(key) && index >= 0 && index < current.length;
	}

	if (isPlainObject(current)) {
		return key in current;
	}

	return false;
}

function isIndexKey(key) {
	return /^\d+$/.test(key);
}

function canAccessKey(current, key) {
	if (Array.isArray(current)) {
		const index = Number(key);
		return isIndexKey(key) && index >= 0 && index < current.length;
	}

	if (isPlainObject(current)) {
		return key in current;
	}

	return false;
}

function getValueByPath(obj, path) {
	const keys = path.split('.');
	let current = obj;

	for (const key of keys) {
		if (!canAccessKey(current, key)) return undefined;
		current = current[key];
	}

	return current;
}

function hasPath(obj, path) {
	const keys = path.split('.');
	let current = obj;

	for (const key of keys) {
		if (!canAccessKey(current, key)) return false;
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

function pushTypeError(messages, path, expected) {
	messages.push({
		type: 'error',
		text: `"${path}" 값은 ${expected}로 입력해야 합니다.`
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
		return null;
	}

	const value = getValueByPath(parsed, path);

	if (!isPlainObject(value)) {
		pushTypeError(messages, path, '{ } 객체');
		return null;
	}

	messages.push({
		type: 'success',
		text: `"${path}" 객체가 확인되었습니다.`
	});

	return value;
}

function validateStringPath({ parsed, path, messages, allowEmpty = false }) {
	if (!hasPath(parsed, path)) {
		pushMissing(messages, path);
		return '';
	}

	const value = getValueByPath(parsed, path);

	if (typeof value !== 'string') {
		pushTypeError(messages, path, '문자열');
		return '';
	}

	if (!allowEmpty && !value.trim()) {
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

function validateNumberPath({ parsed, path, messages, allowed = null }) {
	if (!hasPath(parsed, path)) {
		pushMissing(messages, path);
		return null;
	}

	const value = getValueByPath(parsed, path);

	if (typeof value !== 'number') {
		pushTypeError(messages, path, '숫자');
		return null;
	}

	if (Array.isArray(allowed) && !allowed.includes(value)) {
		messages.push({
			type: 'error',
			text: `"${path}" 값은 ${allowed.join(', ')} 중 하나여야 합니다.`
		});
		return null;
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
		return null;
	}

	const value = getValueByPath(parsed, path);

	if (typeof value !== 'boolean') {
		pushTypeError(messages, path, 'true/false');
		return null;
	}

	messages.push({
		type: 'success',
		text: `"${path}" 값이 확인되었습니다.`
	});

	return value;
}

function validateArrayPath({ parsed, path, messages, minLength = 1 }) {
	if (!hasPath(parsed, path)) {
		pushMissing(messages, path);
		return null;
	}

	const value = getValueByPath(parsed, path);

	if (!Array.isArray(value)) {
		pushTypeError(messages, path, '[ ] 배열');
		return null;
	}

	if (value.length < minLength) {
		messages.push({
			type: 'error',
			text: `"${path}" 배열에는 ${minLength}개 이상 입력해야 합니다.`
		});
		return null;
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

function makeState({ jsonText, mission }) {
	return mapWeatherAppJsonToSimulationState({
		jsonText,
		missionId: mission?.id
	});
}

function successResult({ text, jsonText, mission, extra = {} }) {
	return makeResult(
		true,
		'success',
		[
			{
				type: 'success',
				text
			}
		],
		{
			correct: true,
			simulationState: makeState({ jsonText, mission }),
			...extra
		}
	);
}

function validateAdminLoginMission({ parsed, jsonText, mission }) {
	const rootError = validateRootObject(parsed);
	if (rootError) return rootError;

	const messages = [];

	validateObjectPath({ parsed, path: '관리자접속', messages });
	validateStringPath({ parsed, path: '관리자접속.앱이름', messages });
	validateStringPath({ parsed, path: '관리자접속.관리자', messages });

	const connected = validateBooleanPath({
		parsed,
		path: '관리자접속.접속',
		messages
	});

	if (connected !== true) {
		messages.push({
			type: 'error',
			text: '"관리자접속.접속" 값은 true여야 합니다.'
		});
	}

	if (!isOk(messages)) {
		return makeResult(false, 'condition', messages);
	}

	return successResult({
		text: '분실물찾기 관리자 접속 JSON이 확인되었습니다.',
		jsonText,
		mission
	});
}

function validateCategoryRuleMission({ parsed, jsonText, mission }) {
	const rootError = validateRootObject(parsed);
	if (rootError) return rootError;

	const messages = [];

	validateObjectPath({ parsed, path: '분류기준', messages });
	validateArrayPath({ parsed, path: '분류기준.종류', messages, minLength: 3 });
	validateArrayPath({ parsed, path: '분류기준.보관장소', messages, minLength: 2 });

	const useRule = validateBooleanPath({
		parsed,
		path: '분류기준.기준사용',
		messages
	});

	if (useRule !== true) {
		messages.push({
			type: 'error',
			text: '"분류기준.기준사용" 값은 true여야 합니다.'
		});
	}

	if (!isOk(messages)) {
		return makeResult(false, 'condition', messages);
	}

	return successResult({
		text: '분실물 분류 기준이 준비되었습니다.',
		jsonText,
		mission
	});
}

function validateRegisterLostItemMission({ parsed, jsonText, mission }) {
	const rootError = validateRootObject(parsed);
	if (rootError) return rootError;

	const messages = [];

	validateObjectPath({ parsed, path: '분실물등록', messages });

	validateNumberPath({
		parsed,
		path: '분실물등록.카드번호',
		messages,
		allowed: [1, 2, 3, 4]
	});

	validateStringPath({ parsed, path: '분실물등록.물건이름', messages });
	validateStringPath({ parsed, path: '분실물등록.종류', messages });
	validateStringPath({ parsed, path: '분실물등록.색깔', messages });
	validateStringPath({ parsed, path: '분실물등록.발견장소', messages });
	validateStringPath({ parsed, path: '분실물등록.보관장소', messages });

	const features = validateArrayPath({
		parsed,
		path: '분실물등록.특징',
		messages,
		minLength: 1
	});

	if (features) {
		features.forEach((_, index) => {
			validateStringPath({
				parsed,
				path: `분실물등록.특징.${index}`,
				messages
			});
		});
	}

	validateBooleanPath({ parsed, path: '분실물등록.사진있음', messages });
	validateBooleanPath({ parsed, path: '분실물등록.주인찾음', messages });

	if (!isOk(messages)) {
		return makeResult(false, 'condition', messages);
	}

	return successResult({
		text: '분실물 카드 등록 JSON이 확인되었습니다.',
		jsonText,
		mission
	});
}

export function validateWeatherAppMissionJson({ jsonText, course, missionIndex, roleId }) {
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

	if (mission.id === 'admin-login') {
		return validateAdminLoginMission({
			parsed: parsedResult.data,
			jsonText,
			mission
		});
	}

	if (mission.id === 'category-rule') {
		return validateCategoryRuleMission({
			parsed: parsedResult.data,
			jsonText,
			mission
		});
	}

	if (mission.id === 'register-lost-item') {
		return validateRegisterLostItemMission({
			parsed: parsedResult.data,
			jsonText,
			mission
		});
	}

	return makeResult(false, 'condition', [
		{
			type: 'error',
			text: '분실물찾기 미션 검증 정보를 찾을 수 없습니다.'
		}
	]);
}
