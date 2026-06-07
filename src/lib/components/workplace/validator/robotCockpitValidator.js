// src/lib/components/workplace/validator/robotCockpitValidator.js

import { mapRobotCockpitJsonToSimulationState } from '../theme/robotCockpit/robotCockpitMapper.js';
import { isPlainObject, makeResult, parseJsonWithFriendlyError } from './jsonValidator.js';

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

function pushRequiredTrue(messages, path) {
	messages.push({
		type: 'error',
		text: `"${path}" 값은 true여야 합니다.`
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

function hasOnlySuccess(messages) {
	return messages.length > 0 && messages.every((message) => message.type === 'success');
}

function makeSimulationState({ jsonText, mission }) {
	return mapRobotCockpitJsonToSimulationState({
		jsonText,
		missionId: mission?.id
	});
}

function normalizeJson(value) {
	return JSON.stringify(value);
}

function isAnswerCorrect(parsed, answer) {
	if (!answer) return true;
	return normalizeJson(parsed) === normalizeJson(answer);
}

function validateEnterCockpitMission({ parsed, jsonText, mission }) {
	const rootError = validateRootObject(parsed);
	if (rootError) return rootError;

	const messages = [];

	const entered = validateBooleanPath({
		parsed,
		path: '콕핏입장',
		messages
	});

	if (!hasOnlySuccess(messages)) {
		return makeResult(false, 'condition', messages);
	}

	if (entered !== true) {
		pushRequiredTrue(messages, '콕핏입장');

		return makeResult(false, 'condition', messages);
	}

	const simulationState = makeSimulationState({
		jsonText,
		mission
	});

	return makeResult(
		true,
		'success',
		[
			{
				type: 'success',
				text: '콕핏 진입 명령이 확인되었습니다.'
			}
		],
		{
			correct: true,
			simulationState
		}
	);
}

function validatePowerOnMission({ parsed, jsonText, mission }) {
	const rootError = validateRootObject(parsed);
	if (rootError) return rootError;

	const messages = [];

	const hudOn = validateBooleanPath({
		parsed,
		path: 'HUD전원',
		messages
	});

	const lookChecked = validateBooleanPath({
		parsed,
		path: '시선확인',
		messages
	});

	if (!hasOnlySuccess(messages)) {
		return makeResult(false, 'condition', messages);
	}

	if (hudOn !== true) {
		pushRequiredTrue(messages, 'HUD전원');
	}

	if (lookChecked !== true) {
		pushRequiredTrue(messages, '시선확인');
	}

	if (!hasOnlySuccess(messages)) {
		return makeResult(false, 'condition', messages);
	}

	const simulationState = makeSimulationState({
		jsonText,
		mission
	});

	return makeResult(
		true,
		'success',
		[
			{
				type: 'success',
				text: 'HUD 전원과 시선 확인 명령이 확인되었습니다.'
			}
		],
		{
			correct: true,
			simulationState
		}
	);
}

function validateFireMissileMission({ parsed, jsonText, mission }) {
	const rootError = validateRootObject(parsed);
	if (rootError) return rootError;

	const messages = [];

	validateBooleanPath({
		parsed,
		path: '목표조준',
		messages
	});

	validateBooleanPath({
		parsed,
		path: '미사일발사',
		messages
	});

	if (!hasOnlySuccess(messages)) {
		return makeResult(false, 'condition', messages);
	}

	const answer = mission?.finalAnswer ?? {
		목표조준: true,
		미사일발사: true
	};

	const finalCorrect = isAnswerCorrect(parsed, answer);

	const simulationState = makeSimulationState({
		jsonText,
		mission
	});

	return makeResult(
		true,
		'success',
		[
			{
				type: finalCorrect ? 'success' : 'warning',
				text: finalCorrect
					? '목표 조준과 미사일 발사 명령이 확인되었습니다.'
					: '명령 구조는 맞지만 목표 공격 조건이 정확하지 않습니다. 결과를 공용화면에서 확인하세요.'
			}
		],
		{
			finalCorrect,
			simulationState,
			finalPiece: {
				mode: 'full',
				value: parsed
			}
		}
	);
}

export function validateRobotCockpitMissionJson({ jsonText, course, missionIndex, roleId }) {
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

	if (mission.id === 'enter-cockpit') {
		return validateEnterCockpitMission({
			parsed: parsedResult.data,
			jsonText,
			mission
		});
	}

	if (mission.id === 'power-on') {
		return validatePowerOnMission({
			parsed: parsedResult.data,
			jsonText,
			mission
		});
	}

	if (mission.id === 'fire-missile' || mission.type === 'team-final') {
		return validateFireMissileMission({
			parsed: parsedResult.data,
			jsonText,
			mission
		});
	}

	return makeResult(false, 'condition', [
		{
			type: 'error',
			text: '로봇 콕핏 미션 검증 정보를 찾을 수 없습니다.'
		}
	]);
}
