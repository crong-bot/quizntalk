// src/lib/components/workplace/theme/weatherApp/weatherAppCourse.js

import { weatherAppMissionSuccessStates, weatherAppRoleSuccessStates } from './weatherAppLayers.js';

export const weatherAppCourse = {
	id: 'weather-app',
	title: '날씨 API 앱 만들기',
	subtitle: '날씨 API 데이터를 해석하고 앱 화면에 맞는 JSON으로 정리하세요.',
	icon: '🌦️',
	themeId: 'weatherApp',

	intro: {
		badge: 'WEATHER API',
		title: '날씨 API 앱 만들기',
		subtitle: 'API 데이터를 받아 해석하고, 날씨앱 화면에 표시할 JSON을 완성합니다.',
		image: '/images/themes/weather-app/phone-mockup.png',
		imageAlt: '날씨앱 목업',
		summaryTitle: '현재 상황',
		summary:
			'날씨앱을 만들려면 먼저 API에 연결하고, 받은 데이터를 해석한 뒤 앱 화면에 맞는 구조로 정리해야 합니다.',
		goalTitle: '우리의 임무',
		missionGoal: '4명이 역할을 나누어 날씨 API 데이터를 분석하고, 최종 날씨앱 JSON을 완성하세요.',
		steps: [
			'미션 1에서 날씨 API에 연결합니다.',
			'미션 2에서 역할별 API 데이터를 해석합니다.',
			'미션 3에서 앱 화면에 들어갈 최종 JSON을 완성합니다.'
		],
		tip: '힌트: 숫자는 따옴표 없이, true/false도 따옴표 없이 입력합니다.',
		buttonText: '앱 제작 시작하기'
	},

	roles: [
		{
			id: 'location',
			name: '민서',
			roleName: '지역 담당',
			avatarSrc: '/images/avatars/1.png'
		},
		{
			id: 'current',
			name: '준호',
			roleName: '현재 날씨 담당',
			avatarSrc: '/images/avatars/2.png'
		},
		{
			id: 'forecast',
			name: '서연',
			roleName: '예보 담당',
			avatarSrc: '/images/avatars/3.png'
		},
		{
			id: 'alert',
			name: '도윤',
			roleName: '알림 담당',
			avatarSrc: '/images/avatars/4.png'
		}
	],

	missions: [
		{
			id: 'api-connect',
			title: '날씨 API 연결',
			type: 'individual',
			roleSuccessState: weatherAppRoleSuccessStates.apiConnect,
			successState: weatherAppMissionSuccessStates.apiConnect,
			simulationScope: 'room',
			initialJson: `{
  "API연결": {
    "서비스": "날씨API",
    "도시": "전주",
    "연결": false
  }
}`,
			roleMissions: {
				location: {
					story: {
						call: '지역 담당, 날씨 API 연결 정보를 확인하세요.',
						summary: '앱이 전주 날씨 데이터를 받을 수 있도록 API를 연결해야 합니다.',
						mission: 'API연결.연결 값을 true로 바꾸세요.'
					},
					role: {
						title: '지역 담당',
						icon: '📍',
						description: '날씨 API 연결 지역을 확인합니다.'
					},
					clues: ['서비스는 "날씨API"입니다.', '도시는 "전주"입니다.', '연결은 true여야 합니다.'],
					keyChips: ['API연결', '서비스', '도시', '연결'],
					valueChips: ['날씨API', '전주', 'true', 'false']
				},
				current: {
					story: {
						call: '현재 날씨 담당, API 연결을 시작하세요.',
						summary: '현재 날씨를 받기 위해 API 연결이 필요합니다.',
						mission: 'API연결.연결 값을 true로 바꾸세요.'
					},
					role: {
						title: '현재 날씨 담당',
						icon: '🌡️',
						description: '현재 날씨 데이터 수신을 준비합니다.'
					},
					clues: ['서비스는 "날씨API"입니다.', '도시는 "전주"입니다.', '연결은 true여야 합니다.'],
					keyChips: ['API연결', '서비스', '도시', '연결'],
					valueChips: ['날씨API', '전주', 'true', 'false']
				},
				forecast: {
					story: {
						call: '예보 담당, 예보 데이터를 받을 API를 연결하세요.',
						summary: '예보 배열 데이터를 받으려면 API 연결이 필요합니다.',
						mission: 'API연결.연결 값을 true로 바꾸세요.'
					},
					role: {
						title: '예보 담당',
						icon: '📅',
						description: '예보 데이터 수신을 준비합니다.'
					},
					clues: ['서비스는 "날씨API"입니다.', '도시는 "전주"입니다.', '연결은 true여야 합니다.'],
					keyChips: ['API연결', '서비스', '도시', '연결'],
					valueChips: ['날씨API', '전주', 'true', 'false']
				},
				alert: {
					story: {
						call: '알림 담당, 안전 알림 데이터를 받을 API를 연결하세요.',
						summary: '날씨 알림을 받기 위해 API 연결이 필요합니다.',
						mission: 'API연결.연결 값을 true로 바꾸세요.'
					},
					role: {
						title: '알림 담당',
						icon: '⚠️',
						description: '날씨 안전 알림 수신을 준비합니다.'
					},
					clues: ['서비스는 "날씨API"입니다.', '도시는 "전주"입니다.', '연결은 true여야 합니다.'],
					keyChips: ['API연결', '서비스', '도시', '연결'],
					valueChips: ['날씨API', '전주', 'true', 'false']
				}
			}
		},

		{
			id: 'api-analyze',
			title: 'API 데이터 해석',
			type: 'individual',
			roleSuccessState: weatherAppRoleSuccessStates.apiAnalyze,
			successState: weatherAppMissionSuccessStates.apiAnalyze,
			simulationScope: 'room',
			initialJson: `{
  "API해석": {
    "담당": "",
    "도시": ""
  }
}`,
			roleMissions: {
				location: {
					story: {
						call: '지역 담당, location 데이터를 해석하세요.',
						summary: 'API의 location.city는 "전주", location.country는 "KR"입니다.',
						mission: '지역 정보를 API해석 JSON으로 정리하세요.'
					},
					role: {
						title: '지역 담당',
						icon: '📍',
						description: '도시와 국가 코드를 해석합니다.'
					},
					clues: [
						'location.city는 "전주"입니다.',
						'location.country는 "KR"입니다.',
						'담당 값은 "지역"입니다.'
					],
					keyChips: ['API해석', '담당', '도시', '국가'],
					valueChips: ['지역', '전주', 'KR'],
					initialJson: `{
  "API해석": {
    "담당": "지역",
    "도시": "",
    "국가": ""
  }
}`
				},
				current: {
					story: {
						call: '현재 날씨 담당, current 데이터를 해석하세요.',
						summary: 'API의 current에는 기온, 상태, 습도, 바람 정보가 있습니다.',
						mission: '현재 날씨 정보를 API해석 JSON으로 정리하세요.'
					},
					role: {
						title: '현재 날씨 담당',
						icon: '🌡️',
						description: '현재 기온과 상태를 해석합니다.'
					},
					clues: [
						'current.temp는 28입니다.',
						'current.condition은 "맑음"입니다.',
						'current.humidity는 68입니다.',
						'current.windSpeed는 3.4입니다.',
						'담당 값은 "현재날씨"입니다.'
					],
					keyChips: ['API해석', '담당', '기온', '상태', '습도', '바람'],
					valueChips: ['현재날씨', '맑음', '흐림', '비옴', '28', '68', '3.4'],
					initialJson: `{
  "API해석": {
    "담당": "현재날씨",
    "기온": 0,
    "상태": "",
    "습도": 0,
    "바람": 0
  }
}`
				},
				forecast: {
					story: {
						call: '예보 담당, forecast 배열을 해석하세요.',
						summary: 'API의 forecast는 여러 날의 예보가 배열로 들어 있습니다.',
						mission: '예보 배열을 API해석 JSON으로 정리하세요.'
					},
					role: {
						title: '예보 담당',
						icon: '📅',
						description: '요일별 예보 배열을 해석합니다.'
					},
					clues: [
						'첫 번째 예보는 월요일, 최저 22, 최고 30, 강수확률 10입니다.',
						'두 번째 예보는 화요일, 최저 23, 최고 29, 강수확률 60입니다.',
						'담당 값은 "예보"입니다.'
					],
					keyChips: ['API해석', '담당', '예보', '요일', '최저', '최고', '강수확률'],
					valueChips: ['예보', '월', '화', '22', '30', '23', '29', '10', '60'],
					initialJson: `{
  "API해석": {
    "담당": "예보",
    "예보": [
      {
        "요일": "",
        "최저": 0,
        "최고": 0,
        "강수확률": 0
      }
    ]
  }
}`
				},
				alert: {
					story: {
						call: '알림 담당, alerts 데이터를 해석하세요.',
						summary: 'API의 alerts에는 날씨 안전 알림이 들어 있습니다.',
						mission: '알림 정보를 API해석 JSON으로 정리하세요.'
					},
					role: {
						title: '알림 담당',
						icon: '⚠️',
						description: '날씨 안전 알림을 해석합니다.'
					},
					clues: [
						'alerts.type은 "폭염주의보"입니다.',
						'alerts.message는 "낮 시간 야외 활동을 줄이세요."입니다.',
						'담당 값은 "알림"입니다.'
					],
					keyChips: ['API해석', '담당', '종류', '안내문'],
					valueChips: ['알림', '폭염주의보', '낮 시간 야외 활동을 줄이세요.'],
					initialJson: `{
  "API해석": {
    "담당": "알림",
    "종류": "",
    "안내문": ""
  }
}`
				}
			}
		},

		{
			id: 'app-build',
			title: '날씨앱 데이터 완성',
			type: 'team-final',
			roleSuccessState: weatherAppRoleSuccessStates.appBuild,
			successState: weatherAppMissionSuccessStates.appBuild,
			simulationScope: 'room',
			finalSubmitMode: 'full',
			waitForFinalResultCallback: false,
			requireSameFinalSubmissions: true,
			finalMismatchMessage:
				'팀원들의 최종 날씨앱 JSON이 서로 다릅니다. 회의 후 같은 앱 데이터를 다시 제출하세요.',
			initialJson: `{
  "날씨앱": {
    "지역": "",
    "현재날씨": {
      "기온": 0,
      "상태": "",
      "습도": 0,
      "바람": 0
    },
    "예보": [],
    "알림": {
      "종류": "",
      "안내문": ""
    },
    "앱실행": false
  }
}`,
			finalAnswer: {
				날씨앱: {
					지역: '전주',
					현재날씨: {
						기온: 28,
						상태: '맑음',
						습도: 68,
						바람: 3.4
					},
					예보: [
						{
							요일: '월',
							최저: 22,
							최고: 30,
							강수확률: 10
						},
						{
							요일: '화',
							최저: 23,
							최고: 29,
							강수확률: 60
						}
					],
					알림: {
						종류: '폭염주의보',
						안내문: '낮 시간 야외 활동을 줄이세요.'
					},
					앱실행: true
				}
			},
			roleMissions: {
				location: {
					story: {
						call: '지역 담당, 최종 앱 데이터에 지역 정보를 넣으세요.',
						summary: '팀원이 해석한 데이터를 합쳐 날씨앱 JSON을 완성해야 합니다.',
						mission: '날씨앱 JSON에 지역 정보를 포함하세요.'
					},
					role: {
						title: '지역 담당',
						icon: '📍',
						description: '최종 앱 데이터의 지역 정보를 확인합니다.'
					},
					clues: ['지역은 "전주"입니다.', '앱실행은 true여야 합니다.'],
					keyChips: ['날씨앱', '지역', '앱실행'],
					valueChips: ['전주', 'true', 'false']
				},
				current: {
					story: {
						call: '현재 날씨 담당, 현재날씨 객체를 완성하세요.',
						summary: '기온, 상태, 습도, 바람 정보를 최종 JSON에 넣어야 합니다.',
						mission: '현재날씨 객체를 완성하세요.'
					},
					role: {
						title: '현재 날씨 담당',
						icon: '🌡️',
						description: '최종 앱 데이터의 현재 날씨를 확인합니다.'
					},
					clues: [
						'기온은 28입니다.',
						'상태는 "맑음"입니다.',
						'습도는 68입니다.',
						'바람은 3.4입니다.'
					],
					keyChips: ['현재날씨', '기온', '상태', '습도', '바람'],
					valueChips: ['28', '맑음', '흐림', '비옴', '68', '3.4']
				},
				forecast: {
					story: {
						call: '예보 담당, 예보 배열을 완성하세요.',
						summary: '요일별 예보는 배열 형태로 정리해야 합니다.',
						mission: '예보 배열을 완성하세요.'
					},
					role: {
						title: '예보 담당',
						icon: '📅',
						description: '최종 앱 데이터의 예보 배열을 확인합니다.'
					},
					clues: [
						'월요일 예보는 최저 22, 최고 30, 강수확률 10입니다.',
						'화요일 예보는 최저 23, 최고 29, 강수확률 60입니다.'
					],
					keyChips: ['예보', '요일', '최저', '최고', '강수확률'],
					valueChips: ['월', '화', '22', '30', '23', '29', '10', '60']
				},
				alert: {
					story: {
						call: '알림 담당, 알림 객체를 완성하세요.',
						summary: '날씨앱 하단에 표시될 안전 알림을 넣어야 합니다.',
						mission: '알림 객체를 완성하세요.'
					},
					role: {
						title: '알림 담당',
						icon: '⚠️',
						description: '최종 앱 데이터의 알림 정보를 확인합니다.'
					},
					clues: ['종류는 "폭염주의보"입니다.', '안내문은 "낮 시간 야외 활동을 줄이세요."입니다.'],
					keyChips: ['알림', '종류', '안내문'],
					valueChips: ['폭염주의보', '낮 시간 야외 활동을 줄이세요.']
				}
			}
		}
	],

	completion: {
		badge: 'WEATHER APP COMPLETE',
		title: '날씨앱 완성!',
		subtitle: 'API 데이터를 해석해 앱 화면에 표시할 JSON을 완성했습니다.',
		summaryTitle: '최종 결과',
		summary: '날씨 API 연결, 데이터 해석, 앱 데이터 정리가 모두 완료되었습니다.',
		primaryButtonText: '홈으로'
	}
};
