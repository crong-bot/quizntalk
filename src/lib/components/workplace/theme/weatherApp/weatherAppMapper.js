// src/lib/components/workplace/theme/weatherApp/weatherAppMapper.js

import { weatherAppLayers } from './weatherAppLayers.js';

function parseJson(jsonText) {
	try {
		return JSON.parse(jsonText);
	} catch {
		return null;
	}
}

function createBaseLayers() {
	return {
		[weatherAppLayers.background]: true,
		[weatherAppLayers.phoneMockup]: true
	};
}

// 중요: patch만 반환해야 함.
// item1~item4: null 같은 초기값을 매번 넣으면 이전 카드가 지워질 수 있음.
function createBaseState() {
	return {
		layers: createBaseLayers(),
		sprites: {},
		camera: {},
		flags: {}
	};
}

function normalizeText(value) {
	return typeof value === 'string' ? value.trim() : '';
}

function getCardNumberFromRoleId(roleId) {
	if (roleId === 'item1') return 1;
	if (roleId === 'item2') return 2;
	if (roleId === 'item3') return 3;
	if (roleId === 'item4') return 4;
	return null;
}

function mapAdminLogin(parsed, state) {
	const data = parsed?.관리자접속 ?? {};

	state.flags.managerConnected = data?.접속 === true;
	state.flags.appName = normalizeText(data?.앱이름) || '분실물찾기';
	state.flags.managerName = normalizeText(data?.관리자) || '관리자';
	state.flags.schoolName = normalizeText(data?.학교) || '';

	return state;
}

function mapCategoryRule(parsed, state) {
	const data = parsed?.분류기준 ?? {};

	state.flags.managerConnected = true;
	state.flags.categoryReady = data?.기준사용 === true;

	state.flags.categories = Array.isArray(data?.종류)
		? data.종류.map((value) => normalizeText(value)).filter(Boolean)
		: [];

	state.flags.storagePlaces = Array.isArray(data?.보관장소)
		? data.보관장소.map((value) => normalizeText(value)).filter(Boolean)
		: [];

	return state;
}

function mapLostItemRegister(parsed, state, roleId) {
	const data = parsed?.분실물등록 ?? {};

	// roleId가 있으면 roleId 기준을 우선 사용.
	// 그래야 1번 담당이 카드번호를 실수로 3으로 바꿔도 item1에 들어감.
	const roleCardNumber = getCardNumberFromRoleId(roleId);
	const jsonCardNumber = Number(data?.카드번호);
	const cardNumber = roleCardNumber ?? jsonCardNumber;

	if (![1, 2, 3, 4].includes(cardNumber)) {
		return state;
	}

	state.flags.managerConnected = true;
	state.flags.categoryReady = true;
	state.flags.registerMode = true;

	state.flags[`item${cardNumber}`] = {
		cardNumber,
		name: normalizeText(data?.물건이름),
		category: normalizeText(data?.종류),
		color: normalizeText(data?.색깔),
		foundPlace: normalizeText(data?.발견장소),
		storagePlace: normalizeText(data?.보관장소),
		features: Array.isArray(data?.특징)
			? data.특징.map((value) => normalizeText(value)).filter(Boolean)
			: [],
		hasPhoto: data?.사진있음 === true,
		ownerFound: data?.주인찾음 === true
	};

	return state;
}

function normalizeMapperInput(input) {
	// executeMissionAction에서 mapper(jsonText)로 호출하는 기존 방식 대응
	if (typeof input === 'string') {
		return {
			jsonText: input,
			missionId: null,
			roleId: null
		};
	}

	// validator 또는 mapJsonToSimulationState에서
	// mapper({ jsonText, missionId, roleId })로 넘기는 방식 대응
	return {
		jsonText: input?.jsonText ?? '',
		missionId: input?.missionId ?? null,
		roleId: input?.roleId ?? null
	};
}

export function mapWeatherAppJsonToSimulationState(input) {
	const { jsonText, missionId, roleId } = normalizeMapperInput(input);
	const parsed = parseJson(jsonText);
	const state = createBaseState();

	if (!parsed) return state;

	// missionId가 있으면 우선 사용
	if (missionId === 'admin-login') {
		return mapAdminLogin(parsed, state);
	}

	if (missionId === 'category-rule') {
		return mapCategoryRule(parsed, state);
	}

	if (missionId === 'register-lost-item') {
		return mapLostItemRegister(parsed, state, roleId);
	}

	// missionId가 안 넘어와도 JSON 루트키로 자동 판별
	if (parsed?.관리자접속) {
		return mapAdminLogin(parsed, state);
	}

	if (parsed?.분류기준) {
		return mapCategoryRule(parsed, state);
	}

	if (parsed?.분실물등록) {
		return mapLostItemRegister(parsed, state, roleId);
	}

	return state;
}

export function mapWeatherAppRoomToSimulationState(room) {
	return (
		room?.simulationState ?? {
			layers: createBaseLayers(),
			sprites: {},
			camera: {},
			flags: {
				managerConnected: false,
				categoryReady: false,
				registerMode: false,

				appName: '분실물찾기',
				managerName: '',
				schoolName: '',

				categories: [],
				storagePlaces: [],

				item1: null,
				item2: null,
				item3: null,
				item4: null
			}
		}
	);
}