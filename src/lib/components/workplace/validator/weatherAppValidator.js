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

function getValueByPath(obj, path) {
	const keys = path.split('.');
	let current = obj;

	for (const key of keys) {
		if (!canAccessKey(current, key)) {
			return undefined;
		}

		current = current[key];
	}

	return current;
}

function hasPath(obj, path) {
	const keys = path.split('.');
	let current = obj;

	for (const key of keys) {
		if (!canAccessKey(current, key)) {
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

function validateStringPath({ parsed, path, messages, allowed = null }) {
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

	if (Array.isArray(allowed) && !allowed.includes(value)) {
		messages.push({
			type: 'error',
			text: `"${path}" 값은 ${allowed.join(', ')} 중 하나여야 합니다.`
		});
		return '';
	}

	messages.push({
		type: 'success',
		text: `"${path}" 값이 확인되었습니다.`
	});

	return value;
}

function validateNumberPath({ parsed, path, messages }) {
	if (!hasPath(parsed, path)) {
		pushMissing(messages, path);
		return null;
	}

	const value = getValueByPath(parsed, path);

	if (typeof value !== 'number') {
		pushTypeError(messages, path, '숫자');
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

function validateArrayPath({ parsed, path, messages }) {
	if (!hasPath(parsed, path)) {
		pushMissing(messages, path);
		return null;
	}

	const value = getValueByPath(parsed, path);

	if (!Array.isArray(value)) {
		pushTypeError(messages, path, '[ ] 배열');
		return null;
	}

	if (value.length === 0) {
		messages.push({
			type: 'error',
			text: `"${path}" 배열에는 예보가 1개 이상 있어야 합니다.`
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

function validateApiConnectMission({ parsed, jsonText, mission }) {
	const rootError = validateRootObject(parsed);
	if (rootError) return rootError;

	const messages = [];

	validateObjectPath({ parsed, path: 'API연결', messages });
	validateStringPath({ parsed, path: 'API연결.서비스', messages });
	validateStringPath({ parsed, path: 'API연결.도시', messages });

	const connected = validateBooleanPath({
		parsed,
		path: 'API연결.연결',
		messages
	});

	if (connected !== true) {
		messages.push({
			type: 'error',
			text: '"API연결.연결" 값은 true여야 합니다.'
		});
	}

	if (!isOk(messages)) {
		return makeResult(false, 'condition', messages);
	}

	return makeResult(
		true,
		'success',
		[
			{
				type: 'success',
				text: '날씨 API 연결 정보가 확인되었습니다.'
			}
		],
		{
			correct: true,
			simulationState: makeState({ jsonText, mission })
		}
	);
}

function validateApiAnalyzeMission({ parsed, jsonText, mission, roleId }) {
	const rootError = validateRootObject(parsed);
	if (rootError) return rootError;

	const messages = [];

	validateObjectPath({ parsed, path: 'API해석', messages });

	const part = validateStringPath({
		parsed,
		path: 'API해석.담당',
		messages,
		allowed: ['지역', '현재날씨', '예보', '알림']
	});

	if (part === '지역') {
		validateStringPath({ parsed, path: 'API해석.도시', messages });
		validateStringPath({ parsed, path: 'API해석.국가', messages });
	}

	if (part === '현재날씨') {
		validateNumberPath({ parsed, path: 'API해석.기온', messages });
		validateStringPath({
			parsed,
			path: 'API해석.상태',
			messages,
			allowed: ['맑음', '흐림', '비옴']
		});
		validateNumberPath({ parsed, path: 'API해석.습도', messages });
		validateNumberPath({ parsed, path: 'API해석.바람', messages });
	}

	if (part === '예보') {
		const forecast = validateArrayPath({
			parsed,
			path: 'API해석.예보',
			messages
		});

		if (forecast) {
			forecast.forEach((_, index) => {
				validateStringPath({ parsed, path: `API해석.예보.${index}.요일`, messages });
				validateNumberPath({ parsed, path: `API해석.예보.${index}.최저`, messages });
				validateNumberPath({ parsed, path: `API해석.예보.${index}.최고`, messages });
				validateNumberPath({ parsed, path: `API해석.예보.${index}.강수확률`, messages });
			});
		}
	}

	if (part === '알림') {
		validateStringPath({ parsed, path: 'API해석.종류', messages });
		validateStringPath({ parsed, path: 'API해석.안내문', messages });
	}

	if (!isOk(messages)) {
		return makeResult(false, 'condition', messages);
	}

	return makeResult(
		true,
		'success',
		[
			{
				type: 'success',
				text: 'API 해석 JSON이 확인되었습니다.'
			}
		],
		{
			correct: true,
			simulationState: makeState({ jsonText, mission })
		}
	);
}

function validateAppBuildMission({ parsed, jsonText, mission }) {
	const rootError = validateRootObject(parsed);
	if (rootError) return rootError;

	const messages = [];

	validateObjectPath({ parsed, path: '날씨앱', messages });

	validateStringPath({ parsed, path: '날씨앱.지역', messages });

	validateObjectPath({ parsed, path: '날씨앱.현재날씨', messages });
	validateNumberPath({ parsed, path: '날씨앱.현재날씨.기온', messages });
	validateStringPath({
		parsed,
		path: '날씨앱.현재날씨.상태',
		messages,
		allowed: ['맑음', '흐림', '비옴']
	});
	validateNumberPath({ parsed, path: '날씨앱.현재날씨.습도', messages });
	validateNumberPath({ parsed, path: '날씨앱.현재날씨.바람', messages });

	const forecast = validateArrayPath({
		parsed,
		path: '날씨앱.예보',
		messages
	});

	if (forecast) {
		forecast.forEach((_, index) => {
			validateStringPath({ parsed, path: `날씨앱.예보.${index}.요일`, messages });
			validateNumberPath({ parsed, path: `날씨앱.예보.${index}.최저`, messages });
			validateNumberPath({ parsed, path: `날씨앱.예보.${index}.최고`, messages });
			validateNumberPath({ parsed, path: `날씨앱.예보.${index}.강수확률`, messages });
		});
	}

	validateObjectPath({ parsed, path: '날씨앱.알림', messages });
	validateStringPath({ parsed, path: '날씨앱.알림.종류', messages });
	validateStringPath({ parsed, path: '날씨앱.알림.안내문', messages });

	const appRun = validateBooleanPath({ parsed, path: '날씨앱.앱실행', messages });

	if (appRun !== true) {
		messages.push({
			type: 'error',
			text: '"날씨앱.앱실행" 값은 true여야 합니다.'
		});
	}

	if (!isOk(messages)) {
		return makeResult(false, 'condition', messages);
	}

	return makeResult(
		true,
		'success',
		[
			{
				type: 'success',
				text: '날씨앱 실행 JSON이 확인되었습니다.'
			}
		],
		{
			finalCorrect: true,
			simulationState: makeState({ jsonText, mission }),
			finalPiece: {
				mode: 'full',
				value: parsed
			}
		}
	);
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

	if (mission.id === 'api-connect') {
		return validateApiConnectMission({
			parsed: parsedResult.data,
			jsonText,
			mission
		});
	}

	if (mission.id === 'api-analyze') {
		return validateApiAnalyzeMission({
			parsed: parsedResult.data,
			jsonText,
			mission,
			roleId
		});
	}

	if (mission.id === 'app-build' || mission.type === 'team-final') {
		return validateAppBuildMission({
			parsed: parsedResult.data,
			jsonText,
			mission
		});
	}

	return makeResult(false, 'condition', [
		{
			type: 'error',
			text: '날씨앱 미션 검증 정보를 찾을 수 없습니다.'
		}
	]);
}
