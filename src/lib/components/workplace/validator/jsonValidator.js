// C:\quizntalk\src\lib\components\workplace\validator\jsonValidator.js
import { ParseErrorCode, parse } from 'jsonc-parser';

export function getValueType(value) {
	if (typeof value === 'string') return '문자열';
	if (typeof value === 'number') return '숫자';
	if (typeof value === 'boolean') return '불리언';
	if (Array.isArray(value)) return '배열';
	if (value === null) return 'null';
	if (typeof value === 'object') return '객체';

	return typeof value;
}

export function makeResult(ok, type, messages, extra = {}) {
	return {
		ok,
		type,
		messages,
		...extra
	};
}

export function isPlainObject(value) {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

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
function getParseErrorConcept(errorCode) {
	switch (errorCode) {
		case ParseErrorCode.InvalidSymbol:
		case ParseErrorCode.InvalidCharacter:
		case ParseErrorCode.EndOfFileExpected:
			return 'parse';

		case ParseErrorCode.InvalidNumberFormat:
			return 'numberType';

		case ParseErrorCode.PropertyNameExpected:
			return 'keyName';

		case ParseErrorCode.ValueExpected:
			return 'valueExpected';

		case ParseErrorCode.ColonExpected:
			return 'colon';

		case ParseErrorCode.CommaExpected:
			return 'comma';

		case ParseErrorCode.CloseBraceExpected:
			return 'objectStructure';

		case ParseErrorCode.CloseBracketExpected:
			return 'arrayStructure';

		case ParseErrorCode.UnexpectedEndOfString:
			return 'quote';

		case ParseErrorCode.InvalidEscapeCharacter:
			return 'stringType';

		default:
			return 'parse';
	}
}
export function parseJsonWithFriendlyError(jsonText) {
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

	const concept = getParseErrorConcept(firstError.error);

	return {
		ok: false,
		concept,
		message: `${position.line}번째 줄 ${position.column}번째 칸에서 문법 오류가 있어요.
${getParseErrorMessage(firstError.error)}

${lineText}
${caretLine}`
	};
}
