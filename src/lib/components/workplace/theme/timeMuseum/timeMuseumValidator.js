// src/lib/components/workplace/theme/timeMuseum/timeMuseumValidator.js

const PERIODS = ['선사시대', '삼국시대', '고려시대', '조선시대'];

export const TIME_MUSEUM_RELICS = [
	// 선사시대
	{ id: 'hand-axe', name: '주먹도끼', shortName: '주먹도끼', period: '선사시대', type: '석기' },
	{
		id: 'comb-pattern-pottery',
		name: '빗살무늬토기',
		shortName: '빗살무늬토기',
		period: '선사시대',
		type: '토기'
	},
	{
		id: 'half-moon-stone-knife',
		name: '반달돌칼',
		shortName: '반달돌칼',
		period: '선사시대',
		type: '농경도구'
	},

	// 삼국시대
	{
		id: 'gilt-bronze-pensive-bodhisattva',
		name: '금동반가사유상',
		shortName: '금동반가사유상',
		period: '삼국시대',
		type: '불상'
	},
	{
		id: 'mounted-warrior-pottery',
		name: '가마 인물형 토기',
		shortName: '가마 인물형 토기',
		period: '삼국시대',
		type: '토기'
	},
	{
		id: 'silla-gold-crown',
		name: '신라 금관',
		shortName: '신라 금관',
		period: '삼국시대',
		type: '장신구'
	},

	// 고려시대
	{
		id: 'gyeongcheonsa-pagoda',
		name: '경천사지 10층 석탑',
		shortName: '경천사지 10층 석탑',
		period: '고려시대',
		type: '석탑'
	},
	{
		id: 'celadon-maebyeong',
		name: '청자 상감 구름 학 무늬 매병',
		shortName: '청자 매병',
		period: '고려시대',
		type: '도자기'
	},
	{
		id: 'metal-type',
		name: '금속활자',
		shortName: '금속활자',
		period: '고려시대',
		type: '인쇄도구'
	},

	// 조선시대
	{
		id: 'moon-jar',
		name: '백자 달항아리',
		shortName: '백자 달항아리',
		period: '조선시대',
		type: '도자기'
	},
	{
		id: 'genre-paintings',
		name: '단원 풍속도첩',
		shortName: '단원 풍속도첩',
		period: '조선시대',
		type: '그림'
	},
	{
		id: 'daedongyeojido',
		name: '대동여지도',
		shortName: '대동여지도',
		period: '조선시대',
		type: '지도'
	}
];

export const TIME_MUSEUM_RELICS_BY_PERIOD = {
	선사시대: ['주먹도끼', '빗살무늬토기', '반달돌칼'],
	삼국시대: ['금동반가사유상', '가마 인물형 토기', '신라 금관'],
	고려시대: ['경천사지 10층 석탑', '청자 상감 구름 학 무늬 매병', '금속활자'],
	조선시대: ['백자 달항아리', '단원 풍속도첩', '대동여지도']
};

const RELIC_BY_NAME = new Map(TIME_MUSEUM_RELICS.map((relic) => [relic.name, relic]));
const RELIC_BY_SHORT_NAME = new Map(TIME_MUSEUM_RELICS.map((relic) => [relic.shortName, relic]));

function makeResult(ok, messages = [], extra = {}) {
	return {
		ok,
		messages,
		...extra
	};
}

function success(text, extra = {}) {
	return makeResult(
		true,
		[
			{
				type: 'success',
				text
			}
		],
		extra
	);
}

function error(text, concept = 'data') {
	return makeResult(false, [
		{
			type: 'error',
			text,
			concept
		}
	]);
}

function parseJsonWithMessage(jsonText) {
	try {
		return {
			ok: true,
			value: JSON.parse(jsonText)
		};
	} catch {
		return {
			ok: false,
			message: 'JSON 문법이 올바르지 않습니다. 쉼표, 따옴표, 중괄호를 다시 확인하세요.'
		};
	}
}

function normalizeText(value) {
	return String(value ?? '').trim();
}

function getRelicByInputName(name) {
	const normalized = normalizeText(name);
	return RELIC_BY_NAME.get(normalized) ?? RELIC_BY_SHORT_NAME.get(normalized);
}

function sameArrayIgnoreOrder(input = [], answer = []) {
	if (!Array.isArray(input)) return false;
	if (input.length !== answer.length) return false;

	const normalizedInput = input.map(normalizeText).sort();
	const normalizedAnswer = answer.map(normalizeText).sort();

	return normalizedAnswer.every((item, index) => normalizedInput[index] === item);
}

function validateMission1(data) {
	const systemError = data?.시스템오류;

	if (!systemError || typeof systemError !== 'object' || Array.isArray(systemError)) {
		return error('"시스템오류"는 객체 { } 형태로 작성해야 합니다.', 'object');
	}

	const requiredTrueKeys = ['이름정보오류', '시대정보오류', '전시관배치오류', '복구필요'];

	for (const key of requiredTrueKeys) {
		if (systemError[key] !== true) {
			return error(`"${key}" 값은 true여야 합니다.`, 'boolean');
		}
	}

	return success('시스템 오류 진단 완료! 틀린 부분이 확인되었습니다.');
}

function validateMission2(data, roleId) {
	const relicInfos = data?.유물정보;

	if (!Array.isArray(relicInfos)) {
		return error('"유물정보"는 배열 [ ] 형태로 작성해야 합니다.', 'array');
	}

	if (relicInfos.length !== 3) {
		return error('각 담당자는 유물 3개의 정보를 복구해야 합니다.', 'array');
	}

	const rolePeriodMap = {
		prehistory: '선사시대',
		threeKingdoms: '삼국시대',
		goryeo: '고려시대',
		joseon: '조선시대'
	};

	const expectedPeriod = rolePeriodMap[roleId];

	if (!expectedPeriod) {
		return error('역할 정보를 확인할 수 없습니다.', 'role');
	}

	const expectedNames = TIME_MUSEUM_RELICS_BY_PERIOD[expectedPeriod];
	const inputNames = relicInfos.map((item) => normalizeText(item?.이름));

	if (!sameArrayIgnoreOrder(inputNames, expectedNames)) {
		return error(
			`${expectedPeriod} 담당자는 ${expectedNames.join(', ')} 정보를 복구해야 합니다.`,
			'data'
		);
	}

	for (const item of relicInfos) {
		if (!item || typeof item !== 'object' || Array.isArray(item)) {
			return error('"유물정보" 배열 안에는 객체 { }가 들어가야 합니다.', 'object');
		}

		const name = normalizeText(item.이름);
		const period = normalizeText(item.시대);
		const type = normalizeText(item.종류);

		if (!name || !period || !type) {
			return error('각 유물에는 "이름", "시대", "종류"가 모두 필요합니다.', 'object');
		}

		const relic = getRelicByInputName(name);

		if (!relic) {
			return error(`"${name}"은 이번 유물정보 복구 대상에 없는 유물입니다.`, 'data');
		}

		if (relic.period !== period) {
			return error(`"${name}"의 시대는 "${relic.period}"입니다.`, 'data');
		}

		if (relic.type !== type) {
			return error(`"${name}"의 종류는 "${relic.type}"입니다.`, 'data');
		}
	}

	return success('유물정보 카드 복구 완료! 이름, 시대, 종류가 정상으로 돌아왔습니다.');
}

function validateMission3(data) {
	const arrangement = data?.전시관배치;

	if (!arrangement || typeof arrangement !== 'object' || Array.isArray(arrangement)) {
		return error('"전시관배치"는 객체 { } 형태로 작성해야 합니다.', 'object');
	}

	for (const period of PERIODS) {
		if (!Array.isArray(arrangement[period])) {
			return error(`"${period}" 값은 배열 [ ] 형태여야 합니다.`, 'array');
		}

		const expectedNames = TIME_MUSEUM_RELICS_BY_PERIOD[period];

		if (!sameArrayIgnoreOrder(arrangement[period], expectedNames)) {
			return error(`"${period}" 전시관에는 ${expectedNames.join(', ')}가 들어가야 합니다.`, 'data');
		}
	}

	return success('시대별 전시관 배치 완료! 유물정보관리시스템이 정상 복구되었습니다.', {
		finalCorrect: true
	});
}

export function validateTimeMuseumMissionJson({
	jsonText,
	missionIndex,
	currentMissionIndex,
	roleId
}) {
	const parsed = parseJsonWithMessage(jsonText);

	if (!parsed.ok) {
		return error(parsed.message, 'syntax');
	}

	const data = parsed.value;

	if (!data || typeof data !== 'object' || Array.isArray(data)) {
		return error('가장 바깥쪽은 객체 { } 형태여야 합니다.', 'object');
	}

	const index = Number.isInteger(missionIndex) ? missionIndex : currentMissionIndex;

	if (index === 0) {
		return validateMission1(data);
	}

	if (index === 1) {
		return validateMission2(data, roleId);
	}

	if (index === 2) {
		return validateMission3(data);
	}

	return error('알 수 없는 미션입니다.', 'mission');
}
