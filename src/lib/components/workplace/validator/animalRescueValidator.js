// src/lib/components/workplace/validator/animalRescueValidator.js

import { isPlainObject, makeResult, parseJsonWithFriendlyError } from './jsonValidator.js';

export function validateAnimalRescueMissionJson({ jsonText, missionIndex }) {
	const parsedResult = parseJsonWithFriendlyError(jsonText);

	if (!parsedResult.ok) {
		return parsedResult;
	}

	const data = parsedResult.value;

	if (!isPlainObject(data)) {
		return makeResult({
			ok: false,
			type: 'condition',
			messages: [
				{
					type: 'error',
					text: 'JSON은 { }로 감싼 객체 형태여야 합니다.'
				}
			]
		});
	}

	if (missionIndex === 0) {
		return validateRoleAnalysis(data);
	}

	if (missionIndex === 1) {
		return validateCapturePlan(data);
	}

	return makeResult({
		ok: true,
		type: 'success',
		messages: [
			{
				type: 'success',
				text: '제출할 수 있습니다.'
			}
		]
	});
}

function validateRoleAnalysis(data) {
	const messages = [];

	if (typeof data['분석결과'] !== 'string' || !data['분석결과'].trim()) {
		messages.push({
			type: 'error',
			text: '"분석결과"를 문자열로 입력하세요.'
		});
	}

	if (typeof data['유력장소'] !== 'string' || !data['유력장소'].trim()) {
		messages.push({
			type: 'error',
			text: '"유력장소"를 문자열로 입력하세요. 예: "C"'
		});
	}

	if (typeof data['이유'] !== 'string' || !data['이유'].trim()) {
		messages.push({
			type: 'error',
			text: '"이유"를 문자열로 입력하세요.'
		});
	}

	if (messages.length > 0) {
		return makeResult({
			ok: false,
			type: 'condition',
			messages
		});
	}

	return makeResult({
		ok: true,
		type: 'success',
		messages: [
			{
				type: 'success',
				text: '분석 결과 JSON 형식이 좋습니다. 제출할 수 있습니다.'
			}
		]
	});
}

function validateCapturePlan(data) {
	const messages = [];

	if (typeof data['우선수색지역'] !== 'string' || !data['우선수색지역'].trim()) {
		messages.push({
			type: 'error',
			text: '"우선수색지역"을 문자열로 입력하세요. 예: "C"'
		});
	}

	if (typeof data['포획방법'] !== 'string' || !data['포획방법'].trim()) {
		messages.push({
			type: 'error',
			text: '"포획방법"을 문자열로 입력하세요.'
		});
	}

	if (!Array.isArray(data['필요장비']) || data['필요장비'].length < 2) {
		messages.push({
			type: 'error',
			text: '"필요장비"는 2개 이상의 값이 들어 있는 배열이어야 합니다.'
		});
	}

	if (!Array.isArray(data['판단근거']) || data['판단근거'].length < 2) {
		messages.push({
			type: 'error',
			text: '"판단근거"는 2개 이상의 값이 들어 있는 배열이어야 합니다.'
		});
	}

	if (messages.length > 0) {
		return makeResult({
			ok: false,
			type: 'condition',
			messages
		});
	}

	return makeResult({
		ok: true,
		type: 'success',
		messages: [
			{
				type: 'success',
				text: '포획계획보고서 JSON 형식이 좋습니다. 제출할 수 있습니다.'
			}
		]
	});
}
