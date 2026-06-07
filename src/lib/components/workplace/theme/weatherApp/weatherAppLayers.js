// src/lib/components/workplace/theme/weatherApp/weatherAppLayers.js

export const weatherAppLayers = {
	background: 'background',
	phoneMockup: 'phoneMockup'
};

export const weatherAppRoleSuccessStates = {
	apiConnect: {
		layers: {},
		flags: {}
	},
	apiAnalyze: {
		layers: {},
		flags: {}
	},
	appBuild: {
		layers: {},
		flags: {}
	}
};

export const weatherAppMissionSuccessStates = {
	apiConnect: {
		layers: {},
		flags: {
			apiConnected: true,
			apiAnalyzed: false,
			appReady: false
		}
	},

	apiAnalyze: {
		layers: {},
		flags: {
			apiConnected: true,
			apiAnalyzed: true,
			appReady: false
		}
	},

	appBuild: {
		layers: {},
		flags: {
			apiConnected: true,
			apiAnalyzed: true,
			appReady: true
		}
	}
};

export function createWeatherAppInitialState() {
	return {
		layers: {
			[weatherAppLayers.background]: true,
			[weatherAppLayers.phoneMockup]: true
		},

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
