// src/lib/components/workplace/validator/monsterDefenseValidator.js

import {
	getValueType,
	isPlainObject,
	makeResult,
	parseJsonWithFriendlyError
} from './jsonValidator.js';

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

function pushTypeError(messages, path, expectedValue) {
	messages.push({
		type: 'error',
		text: `"${path}" 값은 ${getValueType(expectedValue)}로 입력해야 합니다.`
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

function isSameArray(actualValue, expectedValue) {
	return JSON.stringify(actualValue) === JSON.stringify(expectedValue);
}

function compareObject({ parsed, answer, path = '', messages }) {
	for (const [key, expectedValue] of Object.entries(answer)) {
		const currentPath = path ? `${path}.${key}` : key;

		if (!hasPath(parsed, currentPath)) {
			pushMissing(messages, currentPath);
			continue;
		}

		const actualValue = getValueByPath(parsed, currentPath);

		if (Array.isArray(expectedValue)) {
			if (!Array.isArray(actualValue)) {
				messages.push({
					type: 'error',
					text: `"${currentPath}" 값은 [ ] 배열 형태여야 합니다.`
				});
				continue;
			}

			if (!isSameArray(actualValue, expectedValue)) {
				messages.push({
					type: 'warning',
					text: `"${currentPath}" 배열 내용을 다시 확인하세요.`
				});
				continue;
			}

			messages.push({
				type: 'success',
				text: `"${currentPath}" 값이 맞습니다.`
			});

			continue;
		}

		if (isPlainObject(expectedValue)) {
			if (!isPlainObject(actualValue)) {
				messages.push({
					type: 'error',
					text: `"${currentPath}" 값은 { } 객체 형태여야 합니다.`
				});
				continue;
			}

			compareObject({
				parsed,
				answer: expectedValue,
				path: currentPath,
				messages
			});

			continue;
		}

		if (typeof actualValue !== typeof expectedValue) {
			pushTypeError(messages, currentPath, expectedValue);
			continue;
		}

		if (actualValue !== expectedValue) {
			messages.push({
				type: 'warning',
				text: `"${currentPath}" 값은 ${JSON.stringify(expectedValue)}이어야 합니다.`
			});
			continue;
		}

		messages.push({
			type: 'success',
			text: `"${currentPath}" 값이 맞습니다.`
		});
	}
}

function validateObjectByAnswer(parsed, answer) {
	const rootError = validateRootObject(parsed);
	if (rootError) return rootError;

	if (!isPlainObject(answer)) {
		return makeResult(false, 'condition', [
			{
				type: 'error',
				text: '이 미션의 정답 데이터가 올바르지 않습니다.'
			}
		]);
	}

	const messages = [];

	compareObject({
		parsed,
		answer,
		messages
	});

	const ok = messages.length > 0 && messages.every((message) => message.type === 'success');

	return makeResult(ok, ok ? 'success' : 'condition', messages);
}

function getMissionAnswer({ mission, roleId }) {
	if (mission?.type === 'team-final') {
		return mission?.finalAnswer;
	}

	return mission?.roleMissions?.[roleId]?.answer;
}

function getSuccessMessage({ mission }) {
	if (mission?.type === 'team-final') {
		return '최종 방어 작전이 완성되었습니다.';
	}

	return '정답입니다. 역할 미션을 완료했습니다.';
}

/* -------------------------------------------------------------------------- */
/* 외부 호출 함수                                                               */
/* -------------------------------------------------------------------------- */

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

	const answer = getMissionAnswer({
		mission,
		roleId
	});

	if (!answer) {
		return makeResult(false, 'condition', [
			{
				type: 'error',
				text:
					mission?.type === 'team-final'
						? '최종 미션의 정답 정보를 찾을 수 없습니다.'
						: '현재 역할의 정답 정보를 찾을 수 없습니다.'
			}
		]);
	}

	const result = validateObjectByAnswer(parsedResult.data, answer);

	if (!result.ok) {
		return result;
	}

	const roleMission = mission?.roleMissions?.[roleId];

	return makeResult(
		true,
		'success',
		[
			{
				type: 'success',
				text: getSuccessMessage({ mission })
			}
		],
		{
			themePatch: mission?.type === 'team-final' ? {} : roleMission?.themePatch ?? {},
			finalPlan: mission?.type === 'team-final' ? parsedResult.data : null
		}
	);
}
