// src/lib/components/workplace/theme/timeMuseum/timeMuseumValidator.js

const ROLE_IDS = ['prehistory', 'threeKingdoms', 'goryeo', 'joseon'];

const MISSION1_ANSWERS = {
	prehistory: '이름 오류',
	threeKingdoms: '종류 오류',
	goryeo: '이름 오류',
	joseon: '배치 오류'
};

const MISSION2_ANSWERS = {
	prehistory: {
		담당시대: '선사시대',
		이름: '주먹도끼',
		종류: '석기'
	},

	threeKingdoms: {
		담당시대: '삼국시대',
		이름: '신라 금관',
		종류: '장신구'
	},

	goryeo: {
		담당시대: '고려시대',
		이름: '청자 매병',
		종류: '도자기'
	},

	joseon: {
		담당시대: '조선시대',
		이름: '대동여지도',
		종류: '지도'
	}
};

const FINAL_COMMAND_KEYS = ['복구명령-01', '복구명령-02', '복구명령-03', '복구명령-04'];

const ROLE_COMMAND_KEY = {
	prehistory: '복구명령-01',
	threeKingdoms: '복구명령-02',
	goryeo: '복구명령-03',
	joseon: '복구명령-04'
};

const FINAL_COMMAND_VALUE = {
	선사시대: '주먹도끼',
	삼국시대: '장신구',
	고려시대: '청자 매병',
	조선시대: '대동여지도'
};

function normalizeText(value) {
	return String(value ?? '')
		.replace(/\s+/g, '')
		.trim();
}

function sameText(a, b) {
	return normalizeText(a) === normalizeText(b);
}

function isPlainObject(value) {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function emptySimulationState() {
	return {
		layers: {},
		sprites: {},
		camera: {},
		flags: {}
	};
}

function successResult(course, missionIndex, roleId) {
	const mission = course?.missions?.[missionIndex];

	const simulationState =
		roleId === 'team'
			? mission?.successState
			: mission?.roleSuccessState?.[roleId] ?? mission?.successState;

	return {
		ok: true,
		messages: [],
		simulationState: simulationState ?? emptySimulationState()
	};
}

function fail(message) {
	return {
		ok: false,
		messages: [
			{
				type: 'error',
				text: message
			}
		]
	};
}

function parseJson(jsonText) {
	try {
		return {
			ok: true,
			data: JSON.parse(jsonText)
		};
	} catch {
		return fail('JSON 형식을 확인하세요. 따옴표, 쉼표, 중괄호가 올바른지 살펴보세요.');
	}
}

// =====================================================
// 미션1 검사
// =====================================================

function validateMission1({ data, roleId, course, missionIndex }) {
	if (!ROLE_IDS.includes(roleId)) {
		return fail('담당 역할을 확인할 수 없습니다.');
	}

	if (!isPlainObject(data)) {
		return fail('JSON 객체 형태로 작성하세요.');
	}

	if (typeof data.오류종류 !== 'string' || normalizeText(data.오류종류) === '') {
		return fail('"오류종류"에 찾은 오류를 작성하세요.');
	}

	const expected = MISSION1_ANSWERS[roleId];

	if (!sameText(data.오류종류, expected)) {
		return fail('자기 시대의 오류 종류를 다시 확인하세요.');
	}

	return successResult(course, missionIndex, roleId);
}

// =====================================================
// 미션2 검사
// =====================================================

function validateMission2({ data, roleId, course, missionIndex }) {
	if (!ROLE_IDS.includes(roleId)) {
		return fail('담당 역할을 확인할 수 없습니다.');
	}

	if (!isPlainObject(data)) {
		return fail('JSON 객체 형태로 작성하세요.');
	}

	const expected = MISSION2_ANSWERS[roleId];

	if (!sameText(data.담당시대, expected.담당시대)) {
		return fail(`"담당시대"는 "${expected.담당시대}"입니다.`);
	}

	if (!isPlainObject(data.수정유물)) {
		return fail('"수정유물"은 객체로 작성하세요.');
	}

	if (!sameText(data.수정유물.이름, expected.이름)) {
		return fail('수정할 유물의 이름을 다시 확인하세요.');
	}

	if (!sameText(data.수정유물.종류, expected.종류)) {
		return fail(`"${expected.이름}"의 올바른 종류를 다시 확인하세요.`);
	}

	const topLevelKeys = Object.keys(data);

	if (
		topLevelKeys.length !== 2 ||
		!topLevelKeys.includes('담당시대') ||
		!topLevelKeys.includes('수정유물')
	) {
		return fail('"담당시대"와 "수정유물"만 작성하세요.');
	}

	const repairKeys = Object.keys(data.수정유물);

	if (repairKeys.length !== 2 || !repairKeys.includes('이름') || !repairKeys.includes('종류')) {
		return fail('"수정유물"에는 "이름"과 "종류"만 작성하세요.');
	}

	return successResult(course, missionIndex, roleId);
}

// =====================================================
// 미션3 복구명령 하나 검사
// =====================================================

function validateOneCommand(commandValue) {
	if (!isPlainObject(commandValue)) {
		return fail('복구명령 안에는 시대별 복구값을 객체로 작성하세요.');
	}

	const periods = Object.keys(FINAL_COMMAND_VALUE);

	for (const period of periods) {
		if (!sameText(commandValue[period], FINAL_COMMAND_VALUE[period])) {
			return fail(`${period}의 복구값을 다시 확인하세요.`);
		}
	}

	const actualPeriods = Object.keys(commandValue);

	if (actualPeriods.length !== periods.length) {
		return fail('복구명령에는 선사시대, 삼국시대, 고려시대, 조선시대만 작성하세요.');
	}

	for (const period of actualPeriods) {
		if (!periods.includes(period)) {
			return fail('복구명령에는 선사시대, 삼국시대, 고려시대, 조선시대만 작성하세요.');
		}
	}

	return {
		ok: true,
		messages: []
	};
}

// =====================================================
// JSON 전체에서 복구명령 찾기
// =====================================================

function collectRestoreCommands(value, result = {}) {
	/*
	 * Firebase 조합값 안에 JSON이 문자열로 들어오는 경우도 처리
	 */
	if (typeof value === 'string') {
		const trimmed = value.trim();

		if (
			(trimmed.startsWith('{') && trimmed.endsWith('}')) ||
			(trimmed.startsWith('[') && trimmed.endsWith(']'))
		) {
			try {
				const parsed = JSON.parse(trimmed);
				collectRestoreCommands(parsed, result);
			} catch {
				// 일반 문자열은 무시
			}
		}

		return result;
	}

	if (Array.isArray(value)) {
		for (const item of value) {
			collectRestoreCommands(item, result);
		}

		return result;
	}

	if (!isPlainObject(value)) {
		return result;
	}

	for (const [key, childValue] of Object.entries(value)) {
		if (FINAL_COMMAND_KEYS.includes(key)) {
			result[key] = childValue;
			continue;
		}

		collectRestoreCommands(childValue, result);
	}

	return result;
}

// =====================================================
// 미션3 검사
// =====================================================

function validateMission3({ data, roleId, course, missionIndex }) {
	/*
	 * 학생 개인 제출 검사
	 */
	if (roleId !== 'team') {
		if (!ROLE_IDS.includes(roleId)) {
			return fail('담당 역할을 확인할 수 없습니다.');
		}

		if (!isPlainObject(data)) {
			return fail('JSON 객체 형태로 작성하세요.');
		}

		const expectedKey = ROLE_COMMAND_KEY[roleId];

		const commands = collectRestoreCommands(data);

		const commandKeys = Object.keys(commands);

		if (commandKeys.length !== 1 || commandKeys[0] !== expectedKey) {
			return fail(`"${expectedKey}" 키를 그대로 사용하세요.`);
		}

		const commandResult = validateOneCommand(commands[expectedKey]);

		if (!commandResult.ok) {
			return commandResult;
		}

		const result = successResult(course, missionIndex, roleId);

		/*
		 * 중요:
		 * JsonMissionWorkspace.svelte에서
		 * validateResult.finalPiece를 Firebase에 저장한다.
		 */
		return {
			...result,
			finalPiece: {
				key: expectedKey,
				value: commands[expectedKey]
			}
		};
	}

	/*
	 * 최종 조합 결과 검사
	 *
	 * finalSubmissions에는 보통 다음 형태가 저장된다.
	 *
	 * {
	 *   "prehistory": {
	 *     "key": "복구명령-01",
	 *     "value": {
	 *       "선사시대": "주먹도끼",
	 *       "삼국시대": "장신구",
	 *       "고려시대": "청자 매병",
	 *       "조선시대": "대동여지도"
	 *     }
	 *   }
	 * }
	 *
	 * buildFinalJsonBySubmitMode에서 이를 합치면
	 * 복구명령-01~04가 최상위 키로 만들어진다.
	 */
	if (!isPlainObject(data) && !Array.isArray(data)) {
		return fail('최종 JSON 조합 결과를 확인할 수 없습니다.');
	}

	const commands = collectRestoreCommands(data);

	const submittedKeys = Object.keys(commands);

	if (submittedKeys.length !== 3 && submittedKeys.length !== 4) {
		return fail(
			`복구명령이 ${submittedKeys.length}개 확인되었습니다. 모둠원 3명 또는 4명의 복구명령이 필요합니다.`
		);
	}

	for (const commandKey of submittedKeys) {
		const commandResult = validateOneCommand(commands[commandKey]);

		if (!commandResult.ok) {
			const detail = commandResult.messages?.[0]?.text ?? '복구값을 확인하세요.';

			return fail(`${commandKey}: ${detail}`);
		}
	}

	return successResult(course, missionIndex, roleId);
}

// =====================================================
// 외부 호출
// =====================================================

export function validateTimeMuseumMission({
	jsonText,
	data,
	course,
	missionIndex,
	currentMissionIndex,
	roleId
}) {
	let parsedData = data;

	if (parsedData === undefined) {
		const parsed = parseJson(jsonText);

		if (!parsed.ok) {
			return parsed;
		}

		parsedData = parsed.data;
	}

	const index = typeof missionIndex === 'number' ? missionIndex : currentMissionIndex;

	switch (index) {
		case 0:
			return validateMission1({
				data: parsedData,
				roleId,
				course,
				missionIndex: index
			});

		case 1:
			return validateMission2({
				data: parsedData,
				roleId,
				course,
				missionIndex: index
			});

		case 2:
			return validateMission3({
				data: parsedData,
				roleId,
				course,
				missionIndex: index
			});

		default:
			return fail('확인할 수 없는 미션입니다.');
	}
}

export const validateTimeMuseumMissionJson = validateTimeMuseumMission;

export const validateTimeMuseumJson = validateTimeMuseumMission;

export default validateTimeMuseumMission;
