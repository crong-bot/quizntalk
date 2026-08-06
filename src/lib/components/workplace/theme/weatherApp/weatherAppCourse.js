// src/lib/components/workplace/theme/weatherApp/weatherAppCourse.js

import { weatherAppMissionSuccessStates, weatherAppRoleSuccessStates } from './weatherAppLayers.js';

export const weatherAppCourse = {
	id: 'weather-app',
	title: '분실물찾기 앱 만들기',
	subtitle: '분실물 분류 기준을 만들고, 실제 분실물을 앱에 등록하세요.',
	icon: '🔎',
	themeId: 'weatherApp',
	difficulty: 'JSON 입문',
	intro: {
		badge: 'LOST ITEM APP',
		title: '분실물찾기 앱 만들기',
		subtitle: '관리자 모드에 접속하고, 분류 기준을 만든 뒤 실제 분실물을 등록합니다.',
		image: '/images/themes/weather-app/phone-mockup.png',
		imageAlt: '분실물찾기 앱 목업',
		summaryTitle: '현재 상황',
		summary:
			'학교에 여러 분실물이 생겼습니다. 분실물찾기 앱에 물건 정보를 등록하면 친구들이 잃어버린 물건을 더 쉽게 찾을 수 있습니다.',
		goalTitle: '우리의 임무',
		missionGoal:
			'4명이 협동하여 분실물 등록 시스템을 준비하고, 각자 실제 분실물 1개씩 등록해 앱 목록을 완성하세요.',
		steps: [
			'미션 1에서 분실물찾기 앱 관리자 모드에 접속합니다.',
			'미션 2에서 분실물을 나눌 분류 기준을 만듭니다.',
			'미션 3에서 각자 실제 분실물 1개를 등록합니다.'
		],
		tip: '힌트: true/false는 따옴표 없이 입력하고, 여러 특징은 [ ] 배열에 넣습니다.',
		buttonText: '앱 만들기 시작하기'
	},

	roles: [
		{
			id: 'item1',
			name: '민서',
			roleName: '1번 등록 담당',
			avatarSrc: '/images/avatars/1.png'
		},
		{
			id: 'item2',
			name: '준호',
			roleName: '2번 등록 담당',
			avatarSrc: '/images/avatars/2.png'
		},
		{
			id: 'item3',
			name: '서연',
			roleName: '3번 등록 담당',
			avatarSrc: '/images/avatars/3.png'
		},
		{
			id: 'item4',
			name: '도윤',
			roleName: '4번 등록 담당',
			avatarSrc: '/images/avatars/4.png'
		}
	],

	missions: [
		{
			id: 'admin-login',
			title: '관리자 접속',
			type: 'individual',
			roleSuccessState: weatherAppRoleSuccessStates.adminLogin,
			successState: weatherAppMissionSuccessStates.adminLogin,
			simulationScope: 'local',
			initialJson: `{
  "관리자접속": {
    "앱이름": 
    "관리자": 
    "학교": 
    "접속":
  }
}`,
			roleMissions: {
				item1: createAdminLoginRoleMission('1번 등록 담당'),
				item2: createAdminLoginRoleMission('2번 등록 담당'),
				item3: createAdminLoginRoleMission('3번 등록 담당'),
				item4: createAdminLoginRoleMission('4번 등록 담당')
			}
		},

		{
			id: 'category-rule',
			title: '분류기준 만들기',
			type: 'individual',
			roleSuccessState: weatherAppRoleSuccessStates.categoryRule,
			successState: weatherAppMissionSuccessStates.categoryRule,
			simulationScope: 'local',
			initialJson: `{
  "분류기준": {
    "종류": ["학용품", "의류", "우산","생활용품",  "기타"],
    "보관장소": ["교무실", "교실", "도서관", "분실물보관함"],
    "기준사용": false
  }
}`,
			roleMissions: {
				item1: {
					story: {
						call: '1번 등록 담당, 분실물 종류 기준을 확인하세요.',
						summary: '분실물을 앱에 등록하려면 먼저 어떤 종류로 나눌지 정해야 합니다.',
						mission: '분류기준.기준사용 값을 true로 바꾸세요.'
					},
					role: {
						title: '1번 등록 담당',
						icon: '🗂️',
						description: '분실물 종류 기준을 확인합니다.'
					},
					clues: [
						'종류 배열에는 학용품, 의류, 우산, 생활용품, 기타 가 들어갑니다.',
						'기준사용 값은 true여야 합니다.'
					],
					keyChips: ['분류기준', '종류', '보관장소', '기준사용'],
					valueChips: createCategoryValueChips()
				},
				item2: {
					story: {
						call: '2번 등록 담당, 보관장소 기준을 확인하세요.',
						summary: '분실물은 정해진 보관장소에 보관되어야 앱에서 찾기 쉽습니다.',
						mission: '분류기준.기준사용 값을 true로 바꾸세요.'
					},
					role: {
						title: '2번 등록 담당',
						icon: '📦',
						description: '보관장소 기준을 확인합니다.'
					},
					clues: [
						'보관장소 배열에는 교무실, 교실, 도서관, 분실물보관함이 들어갑니다.',
						'기준사용 값은 true여야 합니다.'
					],
					keyChips: ['분류기준', '종류', '보관장소', '기준사용'],
					valueChips: createCategoryValueChips()
				},
				item3: {
					story: {
						call: '3번 등록 담당, 분류 기준을 점검하세요.',
						summary: '분실물을 종류와 보관장소로 나누면 목록을 더 쉽게 볼 수 있습니다.',
						mission: '분류기준.기준사용 값을 true로 바꾸세요.'
					},
					role: {
						title: '3번 등록 담당',
						icon: '✅',
						description: '분류 기준을 점검합니다.'
					},
					clues: [
						'종류는 3개 이상 있어야 합니다.',
						'보관장소는 2개 이상 있어야 합니다.',
						'기준사용 값은 true여야 합니다.'
					],
					keyChips: ['분류기준', '종류', '보관장소', '기준사용'],
					valueChips: createCategoryValueChips()
				},
				item4: {
					story: {
						call: '4번 등록 담당, 분실물 등록 기준을 활성화하세요.',
						summary: '기준을 사용해야 실제 분실물 카드가 올바르게 등록됩니다.',
						mission: '분류기준.기준사용 값을 true로 바꾸세요.'
					},
					role: {
						title: '4번 등록 담당',
						icon: '⚙️',
						description: '분류 기준을 활성화합니다.'
					},
					clues: [
						'분류 기준은 종류와 보관장소를 포함해야 합니다.',
						'기준사용 값은 true여야 합니다.'
					],
					keyChips: ['분류기준', '종류', '보관장소', '기준사용'],
					valueChips: createCategoryValueChips()
				}
			}
		},

		{
			id: 'register-lost-item',
			title: '실제 분실물 등록하기',
			type: 'individual',
			roleSuccessState: weatherAppRoleSuccessStates.registerLostItem,
			successState: weatherAppMissionSuccessStates.registerLostItem,
			simulationScope: 'room',
			initialJson: `{
  "분실물등록": {
    "카드번호": 1,
    "종류": "",
    "색깔": "",
    "발견장소": "",
    "보관장소": "",
    "특징": [],
    "주인찾음": false
  }
}`,
			roleMissions: {
				item1: createRegisterRoleMission({
					roleTitle: '1번 등록 담당',
					cardNumber: 1
				}),
				item2: createRegisterRoleMission({
					roleTitle: '2번 등록 담당',
					cardNumber: 2
				}),
				item3: createRegisterRoleMission({
					roleTitle: '3번 등록 담당',
					cardNumber: 3
				}),
				item4: createRegisterRoleMission({
					roleTitle: '4번 등록 담당',
					cardNumber: 4
				})
			}
		}
	],

	completion: {
		badge: 'LOST ITEM APP COMPLETE',
		title: '분실물찾기 앱 완성!',
		subtitle: '4개의 분실물 카드가 등록되었습니다.',
		summaryTitle: '최종 결과',
		summary:
			'관리자 접속, 분류 기준 만들기, 실제 분실물 등록이 모두 완료되었습니다. 이제 앱에서 분실물 목록을 확인할 수 있습니다.',
		primaryButtonText: '홈으로'
	}
};

function createAdminLoginRoleMission(roleTitle) {
	return {
		story: {
			call: `${roleTitle}, 관리자 접속 정보를 확인하세요.`,
			summary: '분실물 등록을 시작하려면 먼저 관리자 모드에 접속해야 합니다.',
			mission: '관리자접속.접속 값을 true로 바꾸세요.'
		},
		role: {
			title: roleTitle,
			icon: '🔐',
			description: '관리자 접속을 준비합니다.'
		},
		clues: [
			'앱이름은 "분실물찾기"입니다.',
			'관리자는 "선생님"입니다.',
			'자신의 학교이름을 입력합니다.',
			'접속 값은 true여야 합니다.'
		],
		keyChips: ['관리자접속', '앱이름', '관리자', '학교', '접속'],
		valueChips: ['분실물찾기', '선생님', 'true', 'false']
	};
}

function createCategoryValueChips() {
	return [
		'학용품',
		'의류',
		'생활용품',
		'우산',
		'기타',
		'교무실',
		'교실',
		'도서관',
		'분실물보관함',
		'true',
		'false'
	];
}

function createRegisterRoleMission({ roleTitle, cardNumber }) {
	return {
		story: {
			call: `${roleTitle}, 실제 조사한 분실물 1개를 등록하세요.`,
			summary: `카드번호 ${cardNumber}번에 실제 분실물 정보를 입력하면 앱 목록에 ${cardNumber}번째 카드가 생깁니다.`,
			mission: '종류, 색깔, 발견장소, 보관장소, 특징을 입력하세요.'
		},
		role: {
			title: roleTitle,
			icon: '📝',
			description: `${cardNumber}번 분실물 카드를 등록합니다.`
		},
		clues: [
			`카드번호는 ${cardNumber}입니다.`,
			'특징은 [ ] 배열에 1개 이상 입력하세요.',
			'사진이 있으면 사진있음은 true, 없으면 false입니다.',
			'주인찾음은 처음에는 false가 좋습니다.'
		],
		keyChips: [
			'분실물등록',
			'카드번호',
			'종류',
			'색깔',
			'발견장소',
			'보관장소',
			'특징',
			'사진있음',
			'주인찾음'
		],
		valueChips: [
			String(cardNumber),
			'학용품',
			'의류',
			'생활용품',
			'우산',
			'기타',
			'교무실',
			'교실',
			'도서관',
			'분실물보관함',
			'true',
			'false'
		],
		initialJson: `{
  "분실물등록": {
    "카드번호": ${cardNumber},
    "종류": "",
    "색깔": "",
    "발견장소": "",
    "보관장소": "",
    "특징": [""],
    "사진있음": false,
    "주인찾음": false
  }
}`
	};
}
