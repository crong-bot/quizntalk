import {
	getValueType,
	isPlainObject,
	makeResult,
	parseJsonWithFriendlyError
} from './jsonValidator.js';

function validateExactAnswer(parsed, answer) {
	const messages = [];

	if (!isPlainObject(parsed)) {
		return {
			ok: false,
			messages: [
				{
					type: 'error',
					text: 'JSON은 { }로 감싼 객체 형태여야 합니다.'
				}
			]
		};
	}

	for (const key of Object.keys(answer)) {
		const expectedValue = answer[key];
		const userValue = parsed[key];

		if (!(key in parsed)) {
			messages.push({
				type: 'error',
				text: `"${key}" 키가 없습니다.`
			});
			continue;
		}

		if (typeof userValue !== typeof expectedValue) {
			messages.push({
				type: 'error',
				text: `"${key}" 값의 자료형이 다릅니다. ${getValueType(expectedValue)}로 입력해야 합니다.`
			});
			continue;
		}

		if (userValue !== expectedValue) {
			messages.push({
				type: 'warning',
				text: `"${key}" 값이 다릅니다. 단서를 다시 확인하세요.`
			});
			continue;
		}

		messages.push({
			type: 'success',
			text: `"${key}" 값이 맞습니다.`
		});
	}

	return {
		ok: messages.every((message) => message.type === 'success'),
		messages
	};
}

function validateFinalPiece(parsed, finalPiece) {
	if (!isPlainObject(parsed)) {
		return makeResult(false, 'condition', [
			{
				type: 'error',
				text: 'JSON은 { }로 감싼 객체 형태여야 합니다.'
			}
		]);
	}

	const { key, value } = finalPiece;
	const userValue = parsed[key];

	if (!(key in parsed)) {
		return makeResult(false, 'condition', [
			{
				type: 'error',
				text: `"${key}" 키가 없습니다.`
			}
		]);
	}

	if (typeof userValue !== typeof value) {
		return makeResult(false, 'condition', [
			{
				type: 'error',
				text: `"${key}" 값은 ${getValueType(value)}로 입력해야 합니다.`
			}
		]);
	}

	if (userValue !== value) {
		return makeResult(false, 'condition', [
			{
				type: 'warning',
				text: `"${key}" 값이 다릅니다. 단서를 다시 확인하세요.`
			}
		]);
	}

	return makeResult(
		true,
		'condition',
		[
			{
				type: 'success',
				text: `"${key}" 값 제출 준비가 완료되었습니다.`
			}
		],
		{
			finalPiece
		}
	);
}
function validateFinalTeamJson(parsed) {
	if (!isPlainObject(parsed)) {
		return makeResult(false, 'condition', [
			{
				type: 'error',
				text: '최종 JSON은 { }로 감싼 객체 형태여야 합니다.'
			}
		]);
	}

	const answer = {
		전력: 100,
		산소: true,
		통신코드: 'AD32',
		탐사로봇: true
	};

	const result = validateExactAnswer(parsed, answer);

	return makeResult(result.ok, result.ok ? 'success' : 'condition', result.messages);
}

export function validateSpaceBaseMissionJson({ jsonText, course, missionIndex, roleId }) {
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

	if (mission.type === 'team-final' && roleId === 'team') {
		return validateFinalTeamJson(parsedResult.data);
	}

	const roleMission = mission.roleMissions?.[roleId];

	if (!roleMission) {
		return makeResult(false, 'condition', [
			{
				type: 'error',
				text: '현재 역할의 미션 정보를 찾을 수 없습니다.'
			}
		]);
	}

	if (mission.type === 'team-final') {
		return validateFinalPiece(parsedResult.data, roleMission.finalPiece);
	}

	const result = validateExactAnswer(parsedResult.data, roleMission.answer);

	return makeResult(result.ok, result.ok ? 'success' : 'condition', result.messages);
}
