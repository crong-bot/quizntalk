// src/lib/components/workplace/theme/weatherApp/weatherAppLayers.js

export const weatherAppLayers = {
	background: 'background',
	phoneMockup: 'phoneMockup'
};

export const weatherAppRoleSuccessStates = {
	adminLogin: {
		layers: {},
		flags: {}
	},
	categoryRule: {
		layers: {},
		flags: {}
	},
	registerLostItem: {
		layers: {},
		flags: {}
	}
};

export const weatherAppMissionSuccessStates = {
	adminLogin: {
		layers: {},
		flags: {
			managerConnected: true,
			categoryReady: false
		}
	},

	categoryRule: {
		layers: {},
		flags: {
			managerConnected: true,
			categoryReady: true
		}
	},

	registerLostItem: {
		layers: {},
		flags: {
			managerConnected: true,
			categoryReady: true,
			registerMode: true
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
	};
}
