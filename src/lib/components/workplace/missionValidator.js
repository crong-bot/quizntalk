import { ParseErrorCode, parse } from 'jsonc-parser';

function getLineColumn(text, offset) {
	const before = text.slice(0, offset);
	const lines = before.split('\n');

	return {
		line: lines.length,
		column: lines[lines.length - 1].length + 1
	};
}

function getLineText(text, lineNumber) {
	return text.split('\n')[lineNumber - 1] ?? '';
}

function makeCaretLine(column) {
	return `${' '.repeat(Math.max(column - 1, 0))}^`;
}

function getParseErrorMessage(errorCode) {
	switch (errorCode) {
		case ParseErrorCode.InvalidSymbol:
			return '알 수 없는 문자가 있어요. 따옴표, 쉼표, 중괄호를 확인하세요.';
		case ParseErrorCode.InvalidNumberFormat:
			return '숫자 모양이 올바르지 않아요.';
		case ParseErrorCode.PropertyNameExpected:
			return '키 이름이 필요해요. 예: "기지번호"';
		case ParseErrorCode.ValueExpected:
			return '값이 필요해요. 예: true, 80, "전력센터"';
		case ParseErrorCode.ColonExpected:
			return '키와 값 사이에는 콜론(:)이 필요해요.';
		case ParseErrorCode.CommaExpected:
			return '항목 사이에는 쉼표(,)가 필요해요.';
		case ParseErrorCode.CloseBraceExpected:
			return '닫는 중괄호 } 가 필요해요.';
		case ParseErrorCode.CloseBracketExpected:
			return '닫는 대괄호 ] 가 필요해요.';
		case ParseErrorCode.EndOfFileExpected:
			return 'JSON 끝난 뒤에 불필요한 글자가 있어요.';
		case ParseErrorCode.UnexpectedEndOfString:
			return '문자 값을 닫는 따옴표(")가 필요해요.';
		case ParseErrorCode.InvalidEscapeCharacter:
			return '문자 안에 사용할 수 없는 특수 문자가 있어요.';
		case ParseErrorCode.InvalidCharacter:
			return 'JSON에서 사용할 수 없는 문자가 있어요.';
		default:
			return 'JSON 문법을 확인해 주세요.';
	}
}

function parseJsonWithFriendlyError(jsonText) {
	const errors = [];
	const parsed = parse(jsonText, errors, {
		allowTrailingComma: false,
		disallowComments: true
	});

	if (errors.length === 0) {
		return {
			ok: true,
			data: parsed
		};
	}

	const firstError = errors[0];
	const position = getLineColumn(jsonText, firstError.offset);
	const lineText = getLineText(jsonText, position.line);
	const caretLine = makeCaretLine(position.column);

	return {
		ok: false,
		message: `${position.line}번째 줄 ${position.column}번째 칸에서 문법 오류가 있어요.
${getParseErrorMessage(firstError.error)}

${lineText}
${caretLine}`
	};
}

function getValueType(value) {
	if (typeof value === 'string') return '문자열';
	if (typeof value === 'number') return '숫자';
	if (typeof value === 'boolean') return '불리언';
	if (Array.isArray(value)) return '배열';
	if (value === null) return 'null';
	if (typeof value === 'object') return '객체';

	return typeof value;
}

function makeResult(ok, type, messages, extra = {}) {
	return {
		ok,
		type,
		messages,
		...extra
	};
}

function isPlainObject(value) {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

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

export function validateMissionJson({ jsonText, course, missionIndex, roleId }) {
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
