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

function createBaseState() {
	return {
		layers: createBaseLayers(),
		sprites: {},
		camera: {
			x: 0,
			y: 0,
			zoom: 1,
			shake: false
		},
		flags: {
			apiConnected: false,
			apiAnalyzed: false,
			appReady: false,

			city: '',
			country: '',
			condition: '',
			temp: null,
			humidity: null,
			wind: null,
			forecast: [],
			alert: null
		}
	};
}

function normalizeCondition(condition = '') {
	if (condition.includes('맑')) return '맑음';
	if (condition.includes('흐')) return '흐림';
	if (condition.includes('비')) return '비옴';

	return condition;
}

function mapApiConnect(parsed, state) {
	const api = parsed?.API연결 ?? {};

	state.flags.apiConnected = api?.연결 === true;
	state.flags.city = api?.도시 ?? '';
	state.flags.country = api?.국가 ?? '';

	return state;
}

function mapApiAnalyze(parsed, state) {
	const data = parsed?.API해석 ?? {};

	state.flags.apiConnected = true;
	state.flags.apiAnalyzed = true;

	if (data?.담당 === '지역') {
		state.flags.city = data?.도시 ?? '';
		state.flags.country = data?.국가 ?? '';
	}

	if (data?.담당 === '현재날씨') {
		state.flags.temp = data?.기온 ?? null;
		state.flags.condition = normalizeCondition(data?.상태 ?? '');
		state.flags.humidity = data?.습도 ?? null;
		state.flags.wind = data?.바람 ?? null;
	}

	if (data?.담당 === '예보') {
		state.flags.forecast = Array.isArray(data?.예보) ? data.예보 : [];
	}

	if (data?.담당 === '알림') {
		state.flags.alert = {
			type: data?.종류 ?? '',
			message: data?.안내문 ?? ''
		};
	}

	return state;
}

function mapWeatherApp(parsed, state) {
	const app = parsed?.날씨앱 ?? {};

	state.flags.apiConnected = true;
	state.flags.apiAnalyzed = true;
	state.flags.appReady = app?.앱실행 === true;

	state.flags.city = app?.지역 ?? '';
	state.flags.country = app?.국가 ?? '';

	state.flags.temp = app?.현재날씨?.기온 ?? null;
	state.flags.condition = normalizeCondition(app?.현재날씨?.상태 ?? '');
	state.flags.humidity = app?.현재날씨?.습도 ?? null;
	state.flags.wind = app?.현재날씨?.바람 ?? null;

	state.flags.forecast = Array.isArray(app?.예보) ? app.예보 : [];

	if (app?.알림) {
		state.flags.alert = {
			type: app.알림?.종류 ?? '',
			message: app.알림?.안내문 ?? ''
		};
	}

	return state;
}

export function mapWeatherAppJsonToSimulationState({ jsonText, missionId }) {
	const parsed = parseJson(jsonText);
	const state = createBaseState();

	if (!parsed) return state;

	if (missionId === 'api-connect') {
		return mapApiConnect(parsed, state);
	}

	if (missionId === 'api-analyze') {
		return mapApiAnalyze(parsed, state);
	}

	if (missionId === 'app-build') {
		return mapWeatherApp(parsed, state);
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
				apiConnected: false,
				apiAnalyzed: false,
				appReady: false
			}
		}
	);
}
