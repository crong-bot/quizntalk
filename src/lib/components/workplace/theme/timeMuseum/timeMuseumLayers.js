// src/lib/components/workplace/theme/timeMuseum/timeMuseumLayers.js

export const timeMuseumLayerKeys = {
	systemDiagnosed: 'timeMuseumSystemDiagnosed',
	relicCardsRestored: 'timeMuseumRelicCardsRestored',
	exhibitionArranged: 'timeMuseumExhibitionArranged',
	museumSystemRestored: 'timeMuseumMuseumSystemRestored'
};

export function createTimeMuseumInitialState() {
	return {
		layers: {
			[timeMuseumLayerKeys.systemDiagnosed]: false,
			[timeMuseumLayerKeys.relicCardsRestored]: false,
			[timeMuseumLayerKeys.exhibitionArranged]: false,
			[timeMuseumLayerKeys.museumSystemRestored]: false
		},
		sprites: {},
		camera: {}
	};
}

export const timeMuseumRoleSuccessStates = {
	diagnoseSystem: {
		layers: {
			[timeMuseumLayerKeys.systemDiagnosed]: true
		}
	},

	restoreRelicCards: {
		layers: {
			[timeMuseumLayerKeys.systemDiagnosed]: true,
			[timeMuseumLayerKeys.relicCardsRestored]: true
		}
	},

	arrangeExhibition: {
		layers: {
			[timeMuseumLayerKeys.systemDiagnosed]: true,
			[timeMuseumLayerKeys.relicCardsRestored]: true,
			[timeMuseumLayerKeys.exhibitionArranged]: true,
			[timeMuseumLayerKeys.museumSystemRestored]: true
		}
	}
};

export const timeMuseumMissionSuccessStates = {
	diagnoseSystem: {
		layers: {
			[timeMuseumLayerKeys.systemDiagnosed]: true
		}
	},

	restoreRelicCards: {
		layers: {
			[timeMuseumLayerKeys.systemDiagnosed]: true,
			[timeMuseumLayerKeys.relicCardsRestored]: true
		}
	},

	arrangeExhibition: {
		layers: {
			[timeMuseumLayerKeys.systemDiagnosed]: true,
			[timeMuseumLayerKeys.relicCardsRestored]: true,
			[timeMuseumLayerKeys.exhibitionArranged]: true,
			[timeMuseumLayerKeys.museumSystemRestored]: true
		}
	}
};
