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
			return '키 이름이 필요해요. 예: "배터리"';
		case ParseErrorCode.ValueExpected:
			return '값이 필요해요. 예: true, 80, "생명유지장치"';
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
			parsed
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

export function validatePowerMission(jsonText) {
	const parseResult = parseJsonWithFriendlyError(jsonText);

	if (!parseResult.ok) {
		return {
			ok: false,
			type: 'syntax',
			messages: [
				{
					type: 'error',
					text: parseResult.message
				}
			]
		};
	}

	const parsed = parseResult.parsed;
	const messages = [];

	if (!parsed?.전력) {
		return {
			ok: false,
			type: 'mission',
			messages: [
				{
					type: 'error',
					text: '"전력" 묶음이 필요해요. 예: "전력": { ... }'
				}
			]
		};
	}

	if (parsed.전력.태양광패널 === true) {
		messages.push({
			type: 'success',
			text: '태양광패널 확인 완료'
		});
	} else {
		messages.push({
			type: 'error',
			text: '태양광패널은 true여야 해요. 예: "태양광패널": true'
		});
	}

	if (typeof parsed.전력.배터리 === 'number' && parsed.전력.배터리 >= 50) {
		messages.push({
			type: 'success',
			text: '배터리 확인 완료'
		});
	} else {
		messages.push({
			type: 'error',
			text: '배터리는 50 이상의 숫자여야 해요. 예: "배터리": 80'
		});
	}

	if (parsed.전력.우선공급 === '생명유지장치') {
		messages.push({
			type: 'success',
			text: '우선공급 확인 완료'
		});
	} else if (parsed.전력.우선공급 == null || parsed.전력.우선공급 === '') {
		messages.push({
			type: 'warning',
			text: '우선공급 값이 비어 있어요. 단서의 “생명유지장치”를 떠올려 보세요.'
		});
	} else {
		messages.push({
			type: 'error',
			text: '우선공급은 "생명유지장치"여야 해요.'
		});
	}

	const ok = messages.every((message) => message.type === 'success');

	return {
		ok,
		type: ok ? 'success' : 'mission',
		messages
	};
}
