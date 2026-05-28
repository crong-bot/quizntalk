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
	const safeOffset = Math.max(0, Math.min(offset, text.length));
	const before = text.slice(0, safeOffset);
	const lines = before.split('\n');

	return {
		line: lines.length,
		column: lines[lines.length - 1].length + 1
	};
}

function getLineText(text, lineNumber) {
	return text.split('\n')[lineNumber - 1] ?? '';
}

function getLastNonEmptyLineInfo(text) {
	const lines = text.split('\n');

	for (let index = lines.length - 1; index >= 0; index -= 1) {
		if (lines[index].trim().length > 0) {
			return {
				line: index + 1,
				text: lines[index]
			};
		}
	}

	return {
		line: 1,
		text: ''
	};
}

function markErrorCharacter(lineText, column) {
	const index = Math.max(column - 1, 0);

	if (index >= lineText.length) {
		return `${lineText}❌`;
	}

	return `${lineText.slice(0, index)}❌${lineText.slice(index)}`;
}

function markLineEnd(lineText) {
	return `${lineText}❌`;
}

function makeMarkedLineFromOffset(jsonText, offset) {
	const position = getLineColumn(jsonText, offset);
	const lineText = getLineText(jsonText, position.line);

	return {
		line: position.line,
		text: markErrorCharacter(lineText, position.column)
	};
}

function getParseErrorMessage(errorCode) {
	switch (errorCode) {
		case ParseErrorCode.InvalidSymbol:
			return '알 수 없는 문자가 있어요. 따옴표, 쉼표, 중괄호를 확인하세요.';
		case ParseErrorCode.InvalidNumberFormat:
			return '숫자 모양이 올바르지 않아요.';
		case ParseErrorCode.PropertyNameExpected:
			return '키 이름이 필요해요. 예: "급식"';
		case ParseErrorCode.ValueExpected:
			return '값이 필요해요. 예: true, 80, "쌀밥", ["쌀밥", "미역국"]';
		case ParseErrorCode.ColonExpected:
			return '키와 값 사이에는 콜론(:)이 필요해요.';
		case ParseErrorCode.CommaExpected:
			return '항목 사이에는 쉼표(,)가 필요해요.';
		case ParseErrorCode.CloseBraceExpected:
			return '{ 로 시작했으면 } 로 닫아야 해요.';
		case ParseErrorCode.CloseBracketExpected:
			return '[ 로 시작했으면 ] 로 닫아야 해요.';
		case ParseErrorCode.EndOfFileExpected:
			return 'JSON이 끝난 뒤에 불필요한 글자가 있어요.';
		case ParseErrorCode.UnexpectedEndOfString:
			return '문자 값을 닫는 큰따옴표(")가 필요해요.';
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

function getBracketName(char) {
	if (char === '[') return '대괄호 [';
	if (char === ']') return '대괄호 ]';
	if (char === '{') return '중괄호 {';
	if (char === '}') return '중괄호 }';

	return char;
}

function getExpectedClosingBracket(openChar) {
	if (openChar === '[') return ']';
	if (openChar === '{') return '}';

	return '';
}

function findBracketMismatch(text) {
	const stack = [];
	let inString = false;
	let escaped = false;

	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];

		// 문자열 안쪽의 괄호는 검사하지 않음
		// 예: "설명": "배열은 [ ]로 씁니다"
		if (inString) {
			if (escaped) {
				escaped = false;
				continue;
			}

			if (char === '\\') {
				escaped = true;
				continue;
			}

			if (char === '"') {
				inString = false;
			}

			continue;
		}

		if (char === '"') {
			inString = true;
			continue;
		}

		if (char === '{' || char === '[') {
			stack.push({
				char,
				offset: index
			});
			continue;
		}

		if (char === '}' || char === ']') {
			const last = stack.pop();

			if (!last) {
				return {
					ok: false,
					type: 'extraClosing',
					closeChar: char,
					offset: index
				};
			}

			const isMatched =
				(last.char === '{' && char === '}') ||
				(last.char === '[' && char === ']');

			if (!isMatched) {
				return {
					ok: false,
					type: 'mismatch',
					openChar: last.char,
					closeChar: char,
					openOffset: last.offset,
					offset: index
				};
			}
		}
	}

	if (stack.length > 0) {
		const last = stack[stack.length - 1];

		return {
			ok: false,
			type: 'missingClosing',
			openChar: last.char,
			openOffset: last.offset,
			offset: last.offset
		};
	}

	return {
		ok: true
	};
}

function makeBracketMismatchMessage({ jsonText, mismatch }) {
	const position = getLineColumn(jsonText, mismatch.offset);
	const lineText = getLineText(jsonText, position.line);

	if (mismatch.type === 'mismatch') {
		const expectedCloseChar = getExpectedClosingBracket(mismatch.openChar);

		// 예:
		// "급식": [ "쌀밥", "미역국", "김치"
		// }
		// 이 경우 } 자체보다 배열 닫는 ]가 빠진 것으로 안내
		if (mismatch.openChar === '[' && mismatch.closeChar === '}') {
			const closePosition = getLineColumn(jsonText, mismatch.offset);
			const previousLineNumber = Math.max(closePosition.line - 1, 1);
			const previousLineText = getLineText(jsonText, previousLineNumber);

			const targetLineNumber =
				previousLineText.trim().length > 0 ? previousLineNumber : closePosition.line;

			const targetLineText = getLineText(jsonText, targetLineNumber);

			return {
				concept: 'arrayStructure',
				message: `${targetLineNumber}번째 줄에서 배열을 닫는 기호가 빠졌어요.
${getBracketName(mismatch.openChar)}로 시작했으면 ${getBracketName(expectedCloseChar)}로 닫아야 해요.

${markLineEnd(targetLineText)}`
			};
		}

		// 예:
		// "정보": { "이름": "홍길동"
		// ]
		// 이 경우 ] 자체보다 객체 닫는 }가 빠진 것으로 안내
		if (mismatch.openChar === '{' && mismatch.closeChar === ']') {
			const closePosition = getLineColumn(jsonText, mismatch.offset);
			const previousLineNumber = Math.max(closePosition.line - 1, 1);
			const previousLineText = getLineText(jsonText, previousLineNumber);

			const targetLineNumber =
				previousLineText.trim().length > 0 ? previousLineNumber : closePosition.line;

			const targetLineText = getLineText(jsonText, targetLineNumber);

			return {
				concept: 'objectStructure',
				message: `${targetLineNumber}번째 줄에서 객체를 닫는 기호가 빠졌어요.
${getBracketName(mismatch.openChar)}로 시작했으면 ${getBracketName(expectedCloseChar)}로 닫아야 해요.

${markLineEnd(targetLineText)}`
			};
		}

		const markedLineText = markErrorCharacter(lineText, position.column);

		return {
			concept: mismatch.openChar === '[' ? 'arrayStructure' : 'objectStructure',
			message: `${position.line}번째 줄에서 닫는 기호가 잘못되었어요.
${getBracketName(mismatch.openChar)}로 시작했으면 ${getBracketName(expectedCloseChar)}로 닫아야 해요.
지금은 ${getBracketName(mismatch.closeChar)}로 닫았어요.

${markedLineText}`
		};
	}

	if (mismatch.type === 'missingClosing') {
		const expectedCloseChar = getExpectedClosingBracket(mismatch.openChar);
		const lastLine = getLastNonEmptyLineInfo(jsonText);

		return {
			concept: mismatch.openChar === '[' ? 'arrayStructure' : 'objectStructure',
			message: `${lastLine.line}번째 줄 끝에서 닫는 기호가 빠졌어요.
${getBracketName(mismatch.openChar)}로 시작했으면 ${getBracketName(expectedCloseChar)}로 닫아야 해요.

${markLineEnd(lastLine.text)}`
		};
	}

	const markedLineText = markErrorCharacter(lineText, position.column);

	return {
		concept: 'objectStructure',
		message: `${position.line}번째 줄에 닫는 기호가 너무 많아요.

${markedLineText}`
	};
}

function pickBestParseError(errors) {
	const priority = [
		ParseErrorCode.UnexpectedEndOfString,
		ParseErrorCode.InvalidEscapeCharacter,
		ParseErrorCode.InvalidCharacter,
		ParseErrorCode.InvalidSymbol,
		ParseErrorCode.InvalidNumberFormat,
		ParseErrorCode.ColonExpected,
		ParseErrorCode.CommaExpected,
		ParseErrorCode.PropertyNameExpected,
		ParseErrorCode.ValueExpected,
		ParseErrorCode.CloseBracketExpected,
		ParseErrorCode.CloseBraceExpected,
		ParseErrorCode.EndOfFileExpected
	];

	for (const code of priority) {
		const found = errors.find((error) => error.error === code);

		if (found) return found;
	}

	return errors[0];
}
function findUnclosedDoubleQuoteIssue(text) {
	let inString = false;
	let escaped = false;
	let stringStartOffset = -1;

	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];

		if (inString) {
			if (escaped) {
				escaped = false;
				continue;
			}

			if (char === '\\') {
				escaped = true;
				continue;
			}

			if (char === '"') {
				inString = false;
				stringStartOffset = -1;
				continue;
			}

			// JSON 문자열은 실제 줄바꿈을 포함할 수 없음.
			// 예: "버스번호": "101,
			// 이 상태에서 다음 줄로 넘어가면 닫는 따옴표가 빠진 것으로 봐야 함.
			if (char === '\n' || char === '\r') {
				return {
					ok: false,
					offset: stringStartOffset
				};
			}

			continue;
		}

		if (char === '"') {
			inString = true;
			stringStartOffset = index;
		}
	}

	if (inString) {
		return {
			ok: false,
			offset: stringStartOffset
		};
	}

	return {
		ok: true
	};
}

function findSingleQuoteIssue(text) {
	let inDoubleString = false;
	let escaped = false;

	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];

		if (inDoubleString) {
			if (escaped) {
				escaped = false;
				continue;
			}

			if (char === '\\') {
				escaped = true;
				continue;
			}

			if (char === '"') {
				inDoubleString = false;
			}

			continue;
		}

		if (char === '"') {
			inDoubleString = true;
			continue;
		}

		if (char === "'") {
			return {
				ok: false,
				offset: index
			};
		}
	}

	return {
		ok: true
	};
}

function findCommentIssue(text) {
	let inString = false;
	let escaped = false;

	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];
		const nextChar = text[index + 1];

		if (inString) {
			if (escaped) {
				escaped = false;
				continue;
			}

			if (char === '\\') {
				escaped = true;
				continue;
			}

			if (char === '"') {
				inString = false;
			}

			continue;
		}

		if (char === '"') {
			inString = true;
			continue;
		}

		if (char === '/' && (nextChar === '/' || nextChar === '*')) {
			return {
				ok: false,
				offset: index
			};
		}
	}

	return {
		ok: true
	};
}

function findTrailingCommaIssue(text) {
	let inString = false;
	let escaped = false;

	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];

		if (inString) {
			if (escaped) {
				escaped = false;
				continue;
			}

			if (char === '\\') {
				escaped = true;
				continue;
			}

			if (char === '"') {
				inString = false;
			}

			continue;
		}

		if (char === '"') {
			inString = true;
			continue;
		}

		if (char === ',') {
			let nextIndex = index + 1;

			while (nextIndex < text.length && /\s/.test(text[nextIndex])) {
				nextIndex += 1;
			}

			if (text[nextIndex] === '}' || text[nextIndex] === ']') {
				return {
					ok: false,
					offset: index
				};
			}
		}
	}

	return {
		ok: true
	};
}

function findArrayWrittenWithObjectBraceIssue(text) {
	let inString = false;
	let escaped = false;

	function getPreviousNonSpaceChar(targetIndex) {
		for (let cursor = targetIndex - 1; cursor >= 0; cursor -= 1) {
			if (!/\s/.test(text[cursor])) {
				return text[cursor];
			}
		}

		return '';
	}

	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];

		if (inString) {
			if (escaped) {
				escaped = false;
				continue;
			}

			if (char === '\\') {
				escaped = true;
				continue;
			}

			if (char === '"') {
				inString = false;
			}

			continue;
		}

		if (char === '"') {
			inString = true;
			continue;
		}

		if (char !== '{') continue;

		// 핵심 수정:
		// 배열을 중괄호로 잘못 쓴 경우는 보통
		// "급식": { "쌀밥", "미역국" }
		// 처럼 콜론(:) 뒤의 값 자리에서 발생한다.
		// 최상위 객체 { "좋아하는과목: 과학" }는 여기서 잡으면 안 된다.
		const previousNonSpaceChar = getPreviousNonSpaceChar(index);

		if (previousNonSpaceChar !== ':') {
			continue;
		}

		let cursor = index + 1;

		while (cursor < text.length && /\s/.test(text[cursor])) {
			cursor += 1;
		}

		if (text[cursor] !== '"') continue;

		const firstStringStart = cursor;
		cursor += 1;

		while (cursor < text.length) {
			if (text[cursor] === '\\') {
				cursor += 2;
				continue;
			}

			if (text[cursor] === '"') {
				break;
			}

			cursor += 1;
		}

		cursor += 1;

		while (cursor < text.length && /\s/.test(text[cursor])) {
			cursor += 1;
		}

		// 객체라면 "키": 값 형태로 콜론이 와야 함.
		// 그런데 바로 쉼표나 }가 오면 { "쌀밥", "미역국" }처럼 배열을 잘못 쓴 가능성이 큼.
		if (text[cursor] === ',' || text[cursor] === '}') {
			return {
				ok: false,
				offset: index,
				firstValueOffset: firstStringStart
			};
		}
	}

	return {
		ok: true
	};
}
function findMissingCommaBetweenValuesIssue(text) {
	let inString = false;
	let escaped = false;

	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];

		if (inString) {
			if (escaped) {
				escaped = false;
				continue;
			}

			if (char === '\\') {
				escaped = true;
				continue;
			}

			if (char === '"') {
				inString = false;

				let cursor = index + 1;

				while (cursor < text.length && /\s/.test(text[cursor])) {
					cursor += 1;
				}

				// 예: "이름": "홍길동" "나이": 12
				// 예: ["쌀밥" "미역국"]
				if (text[cursor] === '"') {
					return {
						ok: false,
						offset: cursor
					};
				}
			}

			continue;
		}

		if (char === '"') {
			inString = true;
		}
	}

	return {
		ok: true
	};
}

function makePreCheckError(jsonText) {
	if (jsonText.trim().length === 0) {
		return {
			ok: false,
			concept: 'parse',
			message: `JSON을 입력해 주세요.

❌`
		};
	}

	const commentIssue = findCommentIssue(jsonText);

	if (!commentIssue.ok) {
		const markedLine = makeMarkedLineFromOffset(jsonText, commentIssue.offset);

		return {
			ok: false,
			concept: 'parse',
			message: `${markedLine.line}번째 줄에서 주석을 사용할 수 없어요.
JSON에서는 // 또는 /* */ 주석을 쓰지 않아요.

${markedLine.text}`
		};
	}
		const unclosedDoubleQuoteIssue = findUnclosedDoubleQuoteIssue(jsonText);

	if (!unclosedDoubleQuoteIssue.ok) {
		const position = getLineColumn(jsonText, unclosedDoubleQuoteIssue.offset);
		const lineText = getLineText(jsonText, position.line);

		return {
			ok: false,
			concept: 'quote',
			message: `${position.line}번째 줄에서 문자열을 닫는 큰따옴표(")가 빠졌어요.
문자열은 큰따옴표(")로 시작했으면 큰따옴표(")로 닫아야 해요.

예:
"과학"

${markLineEnd(lineText)}`
		};
	}

	const singleQuoteIssue = findSingleQuoteIssue(jsonText);

	if (!singleQuoteIssue.ok) {
		const markedLine = makeMarkedLineFromOffset(jsonText, singleQuoteIssue.offset);

		return {
			ok: false,
			concept: 'quote',
			message: `${markedLine.line}번째 줄에서 따옴표 모양이 잘못되었어요.
JSON에서는 작은따옴표(' ')가 아니라 큰따옴표(" ")를 사용해야 해요.

${markedLine.text}`
		};
	}

	const trailingCommaIssue = findTrailingCommaIssue(jsonText);

	if (!trailingCommaIssue.ok) {
		const markedLine = makeMarkedLineFromOffset(jsonText, trailingCommaIssue.offset);

		return {
			ok: false,
			concept: 'comma',
			message: `${markedLine.line}번째 줄에서 필요 없는 쉼표가 있어요.
JSON에서는 마지막 항목 뒤에 쉼표를 쓰지 않아요.

${markedLine.text}`
		};
	}

	const arrayBraceIssue = findArrayWrittenWithObjectBraceIssue(jsonText);

	if (!arrayBraceIssue.ok) {
		const markedLine = makeMarkedLineFromOffset(jsonText, arrayBraceIssue.offset);

		return {
			ok: false,
			concept: 'arrayStructure',
			message: `${markedLine.line}번째 줄에서 배열 모양이 잘못되었어요.
여러 값을 순서대로 묶을 때는 중괄호 { }가 아니라 대괄호 [ ]를 사용해야 해요.

잘못된 예:
"급식": { "쌀밥", "미역국", "불고기", "김치" }

올바른 예:
"급식": ["쌀밥", "미역국", "불고기", "김치"]

${markedLine.text}`
		};
	}

	const missingCommaIssue = findMissingCommaBetweenValuesIssue(jsonText);

	if (!missingCommaIssue.ok) {
		const markedLine = makeMarkedLineFromOffset(jsonText, missingCommaIssue.offset);

		return {
			ok: false,
			concept: 'comma',
			message: `${markedLine.line}번째 줄에서 쉼표(,)가 빠진 것 같아요.
항목과 항목 사이에는 쉼표를 넣어야 해요.

${markedLine.text}`
		};
	}

	return {
		ok: true
	};
}

export function parseJsonWithFriendlyError(jsonText) {
	const preCheckError = makePreCheckError(jsonText);

	if (!preCheckError.ok) {
		return preCheckError;
	}

	const bracketMismatch = findBracketMismatch(jsonText);

	if (!bracketMismatch.ok) {
		const friendlyError = makeBracketMismatchMessage({
			jsonText,
			mismatch: bracketMismatch
		});

		return {
			ok: false,
			concept: friendlyError.concept,
			message: friendlyError.message
		};
	}

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

	const firstError = pickBestParseError(errors);
	const position = getLineColumn(jsonText, firstError.offset);
	const lineText = getLineText(jsonText, position.line);
	const markedLineText = markErrorCharacter(lineText, position.column);
	const concept = getParseErrorConcept(firstError.error);

	return {
		ok: false,
		concept,
		message: `${position.line}번째 줄에서 문법 오류가 있어요.
${getParseErrorMessage(firstError.error)}

${markedLineText}`
	};
}