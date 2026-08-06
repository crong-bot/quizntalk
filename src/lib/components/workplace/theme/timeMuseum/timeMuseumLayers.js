// src/lib/components/workplace/theme/timeMuseum/timeMuseumLayers.js

export const timeMuseumLayerKeys = {
	systemDiagnosed: 'timeMuseumSystemDiagnosed',

	prehistoryRestored: 'timeMuseumPrehistoryRestored',
	threeKingdomsRestored: 'timeMuseumThreeKingdomsRestored',
	goryeoRestored: 'timeMuseumGoryeoRestored',
	joseonRestored: 'timeMuseumJoseonRestored',

	relicCardsRestored: 'timeMuseumRelicCardsRestored',
	exhibitionArranged: 'timeMuseumExhibitionArranged',
	museumSystemRestored: 'timeMuseumMuseumSystemRestored'
};

export function createTimeMuseumInitialState() {
	return {
		layers: {
			[timeMuseumLayerKeys.systemDiagnosed]: false,

			[timeMuseumLayerKeys.prehistoryRestored]: false,
			[timeMuseumLayerKeys.threeKingdomsRestored]: false,
			[timeMuseumLayerKeys.goryeoRestored]: false,
			[timeMuseumLayerKeys.joseonRestored]: false,

			[timeMuseumLayerKeys.relicCardsRestored]: false,
			[timeMuseumLayerKeys.exhibitionArranged]: false,
			[timeMuseumLayerKeys.museumSystemRestored]: false
		},

		sprites: {},
		camera: {}
	};
}

/*
 * 역할 개인 성공 상태
 *
 * 미션 2의 시대별 복구 상태는
 * mapper가 학생이 입력한 "담당시대"를 보고 처리한다.
 */
export const timeMuseumRoleSuccessStates = {
	diagnoseSystem: {
		layers: {
			[timeMuseumLayerKeys.systemDiagnosed]: true
		}
	},

	restoreRelicCards: {
		layers: {
			[timeMuseumLayerKeys.systemDiagnosed]: true
		}
	},

	arrangeExhibition: {
		layers: {
			[timeMuseumLayerKeys.systemDiagnosed]: true
		}
	}
};

/*
 * 미션 전체 성공 상태
 */
export const timeMuseumMissionSuccessStates = {
	diagnoseSystem: {
		layers: {
			[timeMuseumLayerKeys.systemDiagnosed]: true
		}
	},

	restoreRelicCards: {
		layers: {
			[timeMuseumLayerKeys.systemDiagnosed]: true,

			[timeMuseumLayerKeys.prehistoryRestored]: true,
			[timeMuseumLayerKeys.threeKingdomsRestored]: true,
			[timeMuseumLayerKeys.goryeoRestored]: true,
			[timeMuseumLayerKeys.joseonRestored]: true,

			[timeMuseumLayerKeys.relicCardsRestored]: true
		}
	},

	arrangeExhibition: {
		layers: {
			[timeMuseumLayerKeys.systemDiagnosed]: true,

			[timeMuseumLayerKeys.prehistoryRestored]: true,
			[timeMuseumLayerKeys.threeKingdomsRestored]: true,
			[timeMuseumLayerKeys.goryeoRestored]: true,
			[timeMuseumLayerKeys.joseonRestored]: true,

			[timeMuseumLayerKeys.relicCardsRestored]: true,
			[timeMuseumLayerKeys.exhibitionArranged]: true,
			[timeMuseumLayerKeys.museumSystemRestored]: true
		}
	}
};
