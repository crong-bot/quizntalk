// src/lib/components/workplace/validator/robotCockpitValidator.js

import { mapRobotCockpitJsonToSimulationState } from '../theme/robotCockpit/robotCockpitMapper.js';
import { isPlainObject, makeResult, parseJsonWithFriendlyError } from './jsonValidator.js';

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

function createEmptySimulationState() {
	return {
		layers: {},
		sprites: {},
		camera: {},
		flags: {}
	};
}

function getRoleMissionAnswer({ mission, roleId }) {
	return mission?.roleMissions?.[roleId]?.answer;
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

		const aKeys = Object.keys(a);
		const bKeys = Object.keys(b);

		if (aKeys.length !== bKeys.length) return false;

		return aKeys.every(
			(key) =>
				Object.prototype.hasOwnProperty.call(b, key) &&
				isDeepEqual(a[key], b[key])
		);
	}

	return false;
}

function getMissingAndWrongMessages({ parsed, answer, basePath = '' }) {
	const messages = [];

	if (!isPlainObject(answer)) {
		if (!isDeepEqual(parsed, answer)) {
			messages.push({
				type: 'error',
				text: `"${basePath}" 값이 미션 조건과 다릅니다.`
			});
		}

		return messages;
	}

	for (const key of Object.keys(answer)) {
		const path = basePath ? `${basePath}.${key}` : key;

		if (!isPlainObject(parsed) || !Object.prototype.hasOwnProperty.call(parsed, key)) {
			messages.push({
				type: 'error',
				text: `"${path}" 값이 없습니다.`
			});
			continue;
		}

		const expectedValue = answer[key];
		const submittedValue = parsed[key];

		if (isPlainObject(expectedValue)) {
			messages.push(
				...getMissingAndWrongMessages({
					parsed: submittedValue,
					answer: expectedValue,
					basePath: path
				})
			);
			continue;
		}

		if (!isDeepEqual(submittedValue, expectedValue)) {
			messages.push({
				type: 'error',
				text: `"${path}" 값이 미션 조건과 다릅니다.`
			});
		}
	}

	return messages;
}

function makeSimulationState({ jsonText, mission }) {
	return mapRobotCockpitJsonToSimulationState({
		jsonText,
		missionId: mission?.id
	});
}

function validateIndividualMission({ parsed, jsonText, mission, roleId }) {
	const rootError = validateRootObject(parsed);
	if (rootError) return rootError;

	const answer = getRoleMissionAnswer({ mission, roleId });

	if (!answer) {
		return makeResult(false, 'condition', [
			{
				type: 'error',
				text: '이 역할의 정답 정보를 찾을 수 없습니다.'
			}
		]);
	}

	const messages = getMissingAndWrongMessages({
		parsed,
		answer
	});

	if (messages.length > 0) {
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
				text: '미션 JSON이 정확히 확인되었습니다.'
			}
		],
		{
			correct: true,
			simulationState
		}
	);
}
function validateTeamFinalMission({ parsed, jsonText, mission }) {
	const rootError = validateRootObject(parsed);
	if (rootError) return rootError;

	const answer = mission?.finalAnswer;

	if (!answer) {
		return makeResult(false, 'condition', [
			{
				type: 'error',
				text: '최종 미션의 정답 정보를 찾을 수 없습니다.'
			}
		]);
	}

	const messages = getMissingAndWrongMessages({
		parsed,
		answer
	});

	const finalCorrect = messages.length === 0;

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
					? '최종 공격 JSON이 확인되었습니다.'
					: 'JSON 구조는 제출되었지만 공격 조건이 정확하지 않습니다. 팀원들과 단서를 다시 확인하세요.'
			},
			...messages
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

	if (mission.id === 'enter-cockpit' || mission.id === 'power-on') {
		return validateIndividualMission({
			parsed: parsedResult.data,
			jsonText,
			mission,
			roleId
		});
	}

	if (mission.id === 'fire-missile' || mission.type === 'team-final') {
		return validateTeamFinalMission({
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