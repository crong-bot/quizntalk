import {
	getValueType,
	isPlainObject,
	parseJsonWithFriendlyError
} from '$lib/components/workplace/validator/jsonValidator.js';

function getStudentValueType(value) {
	if (typeof value === 'string') return '문자열';
	if (typeof value === 'number') return '숫자';
	if (typeof value === 'boolean') return 'true/false';
	if (Array.isArray(value)) return '배열';
	if (isPlainObject(value)) return '객체';

	return getValueType(value);
}

function compareValue(userValue, expectedValue, path = '') {
	const currentPath = path || '전체';

	if (Array.isArray(expectedValue)) {
		if (!Array.isArray(userValue)) {
			return {
				ok: false,
				message: `${currentPath} 값은 배열로 입력해야 해요.`
			};
		}

		if (userValue.length !== expectedValue.length) {
			return {
				ok: false,
				message: `${currentPath} 배열의 개수가 달라요.`
			};
		}

		for (let index = 0; index < expectedValue.length; index += 1) {
			const result = compareValue(
				userValue[index],
				expectedValue[index],
				`${currentPath}[${index}]`
			);

			if (!result.ok) return result;
		}

		return {
			ok: true,
			message: ''
		};
	}

	if (isPlainObject(expectedValue)) {
		if (!isPlainObject(userValue)) {
			return {
				ok: false,
				message: `${currentPath} 값은 객체 형태여야 해요.`
			};
		}

		for (const key of Object.keys(expectedValue)) {
			if (!(key in userValue)) {
				return {
					ok: false,
					message: `"${key}" 키가 없어요.`
				};
			}

			const nextPath = path ? `${path}.${key}` : key;
			const result = compareValue(userValue[key], expectedValue[key], nextPath);

			if (!result.ok) return result;
		}

		return {
			ok: true,
			message: ''
		};
	}

	if (typeof userValue !== typeof expectedValue) {
		return {
			ok: false,
			message: `${currentPath} 값의 종류가 달라요. ${getStudentValueType(
				expectedValue
			)}로 입력해야 해요.`
		};
	}

	if (userValue !== expectedValue) {
		return {
			ok: false,
			message: `${currentPath} 값이 아직 맞지 않아요. 내용을 다시 확인해보세요.`
		};
	}

	return {
		ok: true,
		message: ''
	};
}

export function validateJsonLearningAnswer({ jsonText, lesson }) {
	const parsedResult = parseJsonWithFriendlyError(jsonText);

	if (!parsedResult.ok) {
		return {
			ok: false,
			type: 'syntax',
			concept: parsedResult.concept,
			message: parsedResult.message
		};
	}

	if (!isPlainObject(parsedResult.data)) {
		return {
			ok: false,
			type: 'condition',
			concept: 'objectStructure',
			message: '제이슨은 { }로 감싼 객체 형태여야 해요.'
		};
	}

	const result = compareValue(parsedResult.data, lesson.answer);

	if (!result.ok) {
		return {
			ok: false,
			type: 'condition',
			concept: 'answer',
			message: result.message
		};
	}

	return {
		ok: true,
		type: 'success',
		concept: 'success',
		message: '좋아요! 이번 단계를 정확하게 완성했어요.'
	};
}

export function formatJsonText(jsonText) {
	const parsedResult = parseJsonWithFriendlyError(jsonText);

	if (!parsedResult.ok) {
		return {
			ok: false,
			text: jsonText,
			concept: parsedResult.concept,
			message: parsedResult.message
		};
	}

	return {
		ok: true,
		text: JSON.stringify(parsedResult.data, null, 2),
		message: '보기 좋게 정리했어요.'
	};
}
