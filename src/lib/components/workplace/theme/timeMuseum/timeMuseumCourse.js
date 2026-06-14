// src/lib/components/workplace/theme/timeMuseum/timeMuseumCourse.js

import { timeMuseumMissionSuccessStates, timeMuseumRoleSuccessStates } from './timeMuseumLayers.js';

export const timeMuseumRelics = [
	// 선사시대
	{
		id: 'hand-axe',
		name: '주먹도끼',
		shortName: '주먹도끼',
		period: '선사시대',
		type: '석기',
		imageSrc: '/images/themes/timeMuseum/hand-axe.png'
	},
	{
		id: 'comb-pattern-pottery',
		name: '빗살무늬토기',
		shortName: '빗살무늬토기',
		period: '선사시대',
		type: '토기',
		imageSrc: '/images/themes/timeMuseum/comb-pattern-pottery.png'
	},
	{
		id: 'half-moon-stone-knife',
		name: '반달돌칼',
		shortName: '반달돌칼',
		period: '선사시대',
		type: '농경도구',
		imageSrc: '/images/themes/timeMuseum/half-moon-stone-knife.png'
	},

	// 삼국시대
	{
		id: 'gilt-bronze-pensive-bodhisattva',
		name: '금동반가사유상',
		shortName: '금동반가사유상',
		period: '삼국시대',
		type: '불상',
		imageSrc: '/images/themes/timeMuseum/gilt-bronze-pensive-bodhisattva.png'
	},
	{
		id: 'mounted-warrior-pottery',
		name: '가마 인물형 토기',
		shortName: '가마 인물형 토기',
		period: '삼국시대',
		type: '토기',
		imageSrc: '/images/themes/timeMuseum/mounted-warrior-pottery.png'
	},
	{
		id: 'silla-gold-crown',
		name: '신라 금관',
		shortName: '신라 금관',
		period: '삼국시대',
		type: '장신구',
		imageSrc: '/images/themes/timeMuseum/silla-gold-crown.png'
	},

	// 고려시대
	{
		id: 'gyeongcheonsa-pagoda',
		name: '경천사지 10층 석탑',
		shortName: '경천사지 10층 석탑',
		period: '고려시대',
		type: '석탑',
		imageSrc: '/images/themes/timeMuseum/gyeongcheonsa-pagoda.png'
	},
	{
		id: 'celadon-maebyeong',
		name: '청자 상감 구름 학 무늬 매병',
		shortName: '청자 매병',
		period: '고려시대',
		type: '도자기',
		imageSrc: '/images/themes/timeMuseum/celadon-maebyeong.png'
	},
	{
		id: 'metal-type',
		name: '금속활자',
		shortName: '금속활자',
		period: '고려시대',
		type: '인쇄도구',
		imageSrc: '/images/themes/timeMuseum/metal-type.png'
	},

	// 조선시대
	{
		id: 'moon-jar',
		name: '백자 달항아리',
		shortName: '백자 달항아리',
		period: '조선시대',
		type: '도자기',
		imageSrc: '/images/themes/timeMuseum/moon-jar.png'
	},
	{
		id: 'genre-paintings',
		name: '단원 풍속도첩',
		shortName: '단원 풍속도첩',
		period: '조선시대',
		type: '그림',
		imageSrc: '/images/themes/timeMuseum/genre-paintings.png'
	},
	{
		id: 'daedongyeojido',
		name: '대동여지도',
		shortName: '대동여지도',
		period: '조선시대',
		type: '지도',
		imageSrc: '/images/themes/timeMuseum/daedongyeojido.png'
	}
];

const commonSystemAnswer = {
	시스템오류: {
		이름정보오류: true,
		시대정보오류: true,
		전시관배치오류: true,
		복구필요: true
	}
};

export const timeMuseumCourse = {
	id: 'time-museum',
	title: '유물정보 복구 작전',
	subtitle: '국립중앙박물관 실제 유물 정보를 JSON으로 정리해 전시 시스템을 복구하세요.',
	icon: '🏛️',
	themeId: 'timeMuseum',
	difficulty: 'JSON 중급',
	isRealData: true,
	categoryId: 'write',
	categoryTitle: '제이슨 작성',
	mode: 'write',

	intro: {
		badge: 'MUSEUM DATA SYSTEM',
		title: '국립중앙박물관 유물정보 복구 작전',
		subtitle: '뒤섞인 유물 데이터를 JSON으로 정리하세요.',
		image: '/images/themes/timeMuseum/gilt-bronze-pensive-bodhisattva.png',
		imageAlt: '국립중앙박물관 유물정보관리시스템 오류 화면',
		summaryTitle: '현재 상황',
		summary:
			'국립중앙박물관의 유물정보관리시스템에 오류가 발생했습니다. 유물의 이름, 시대, 종류 정보가 일부 사라지고, 유물들이 잘못된 시대 정보로 표시되고 있습니다.',
		goalTitle: '우리의 임무',
		missionGoal:
			'JSON 데이터를 완성해 틀린 부분을 확인하고, 유물정보 카드를 복구한 뒤, 시대별 전시관 정보를 정상으로 되돌리세요.',
		steps: [
			'미션 1에서 유물정보관리시스템의 틀린 부분을 확인합니다.',
			'미션 2에서 각자 맡은 유물의 이름, 시대, 종류를 복구합니다.',
			'미션 3에서 팀원들의 정보를 모아 유물을 시대별로 정리합니다.'
		],
		tip: '힌트: true / false 값은 따옴표 없이 입력해야 합니다.',
		buttonText: '복구 작전 시작하기'
	},

	roles: [
		{
			id: 'prehistory',
			name: '민서',
			roleName: '선사 유물 담당',
			avatarSrc: '/images/avatars/1.png'
		},
		{
			id: 'threeKingdoms',
			name: '준호',
			roleName: '삼국 유물 담당',
			avatarSrc: '/images/avatars/2.png'
		},
		{
			id: 'goryeo',
			name: '서연',
			roleName: '고려 유물 담당',
			avatarSrc: '/images/avatars/3.png'
		},
		{
			id: 'joseon',
			name: '도윤',
			roleName: '조선 유물 담당',
			avatarSrc: '/images/avatars/4.png'
		}
	],

	missions: [
		{
			id: 'diagnose-system',
			title: '틀린 부분 확인',
			type: 'individual',
			roleSuccessState: timeMuseumRoleSuccessStates.diagnoseSystem,
			successState: timeMuseumMissionSuccessStates.diagnoseSystem,
			simulationScope: 'local',

			initialJson: `{
  "시스템오류": {
    "이름정보오류": false,
    "시대정보오류": false,
    "전시관배치오류": false,
    "복구필요": false
  }
}`,

			roleMissions: {
				prehistory: {
					story: {
						call: '선사 유물 담당, 시스템의 틀린 부분을 확인하세요.',
						summary: '유물정보관리시스템에 이름, 시대, 배치 오류가 발생했습니다.',
						mission: '오류가 있는 항목을 true로 바꾸세요.'
					},
					role: {
						title: '선사 유물 담당',
						icon: '🪨',
						description: '선사시대 유물정보 오류를 확인하는 역할'
					},
					clues: [
						'유물 이름 정보에 오류가 있습니다.',
						'유물 시대 정보에 오류가 있습니다.',
						'전시관 배치 정보에도 오류가 있습니다.',
						'따라서 복구가 필요합니다.'
					],
					keyChips: ['시스템오류', '이름정보오류', '시대정보오류', '전시관배치오류', '복구필요'],
					valueChips: ['true', 'false'],
					answer: commonSystemAnswer
				},

				threeKingdoms: {
					story: {
						call: '삼국 유물 담당, 시스템의 틀린 부분을 확인하세요.',
						summary: '삼국시대 유물정보 일부가 잘못 표시되고 있습니다.',
						mission: '오류가 있는 항목을 true로 바꾸세요.'
					},
					role: {
						title: '삼국 유물 담당',
						icon: '👑',
						description: '삼국시대 유물정보 오류를 확인하는 역할'
					},
					clues: [
						'유물 이름 정보에 오류가 있습니다.',
						'유물 시대 정보에 오류가 있습니다.',
						'전시관 배치 정보에도 오류가 있습니다.',
						'따라서 복구가 필요합니다.'
					],
					keyChips: ['시스템오류', '이름정보오류', '시대정보오류', '전시관배치오류', '복구필요'],
					valueChips: ['true', 'false'],
					answer: commonSystemAnswer
				},

				goryeo: {
					story: {
						call: '고려 유물 담당, 시스템의 틀린 부분을 확인하세요.',
						summary: '고려시대 유물정보 일부가 다른 시대 정보로 표시되고 있습니다.',
						mission: '오류가 있는 항목을 true로 바꾸세요.'
					},
					role: {
						title: '고려 유물 담당',
						icon: '🏺',
						description: '고려시대 유물정보 오류를 확인하는 역할'
					},
					clues: [
						'유물 이름 정보에 오류가 있습니다.',
						'유물 시대 정보에 오류가 있습니다.',
						'전시관 배치 정보에도 오류가 있습니다.',
						'따라서 복구가 필요합니다.'
					],
					keyChips: ['시스템오류', '이름정보오류', '시대정보오류', '전시관배치오류', '복구필요'],
					valueChips: ['true', 'false'],
					answer: commonSystemAnswer
				},

				joseon: {
					story: {
						call: '조선 유물 담당, 시스템의 틀린 부분을 확인하세요.',
						summary: '조선시대 유물정보 카드에 오류가 표시되고 있습니다.',
						mission: '오류가 있는 항목을 true로 바꾸세요.'
					},
					role: {
						title: '조선 유물 담당',
						icon: '📜',
						description: '조선시대 유물정보 오류를 확인하는 역할'
					},
					clues: [
						'유물 이름 정보에 오류가 있습니다.',
						'유물 시대 정보에 오류가 있습니다.',
						'전시관 배치 정보에도 오류가 있습니다.',
						'따라서 복구가 필요합니다.'
					],
					keyChips: ['시스템오류', '이름정보오류', '시대정보오류', '전시관배치오류', '복구필요'],
					valueChips: ['true', 'false'],
					answer: commonSystemAnswer
				}
			}
		},

		{
			id: 'restore-relic-cards',
			title: '유물정보 카드 복구',
			type: 'individual',
			roleSuccessState: timeMuseumRoleSuccessStates.restoreRelicCards,
			successState: timeMuseumMissionSuccessStates.restoreRelicCards,
			simulationScope: 'local',

			initialJson: `{
  "유물정보": [
    {
      "이름": "",
      "시대": "",
      "종류": ""
    }
  ]
}`,

			roleMissions: {
				prehistory: {
					story: {
						call: '선사 유물 담당, 선사시대 유물정보 카드를 복구하세요.',
						summary: '선사시대 유물 3개의 이름, 시대, 종류 정보가 비어 있습니다.',
						mission: '세 유물의 정보를 배열 안 객체 형태로 정리하세요.'
					},
					role: {
						title: '선사 유물 담당',
						icon: '🪨',
						description: '선사시대 유물정보를 복구하는 역할'
					},
					clues: [
						'주먹도끼는 선사시대 유물이며 종류는 석기입니다.',
						'빗살무늬토기는 선사시대 유물이며 종류는 토기입니다.',
						'반달돌칼은 선사시대 유물이며 종류는 농경도구입니다.'
					],
					keyChips: ['유물정보', '이름', '시대', '종류'],
					valueChips: ['"주먹도끼"', '"빗살무늬토기"', '"반달돌칼"', '"선사시대"'],
					answer: {
						유물정보: [
							{ 이름: '주먹도끼', 시대: '선사시대', 종류: '석기' },
							{ 이름: '빗살무늬토기', 시대: '선사시대', 종류: '토기' },
							{ 이름: '반달돌칼', 시대: '선사시대', 종류: '농경도구' }
						]
					}
				},

				threeKingdoms: {
					story: {
						call: '삼국 유물 담당, 삼국시대 유물정보 카드를 복구하세요.',
						summary: '삼국시대 유물 3개의 정보가 손상되었습니다.',
						mission: '세 유물의 정보를 배열 안 객체 형태로 정리하세요.'
					},
					role: {
						title: '삼국 유물 담당',
						icon: '👑',
						description: '삼국시대 유물정보를 복구하는 역할'
					},
					clues: [
						'금동반가사유상은 삼국시대 유물이며 종류는 불상입니다.',
						'가마 인물형 토기는 삼국시대 유물이며 종류는 토기입니다.',
						'신라 금관은 삼국시대 유물이며 종류는 장신구입니다.'
					],
					keyChips: ['유물정보', '이름', '시대', '종류'],
					valueChips: ['"금동반가사유상"', '"가마 인물형 토기"', '"신라 금관"', '"삼국시대"'],
					answer: {
						유물정보: [
							{ 이름: '금동반가사유상', 시대: '삼국시대', 종류: '불상' },
							{ 이름: '가마 인물형 토기', 시대: '삼국시대', 종류: '토기' },
							{ 이름: '신라 금관', 시대: '삼국시대', 종류: '장신구' }
						]
					}
				},

				goryeo: {
					story: {
						call: '고려 유물 담당, 고려시대 유물정보 카드를 복구하세요.',
						summary: '고려시대 유물 3개의 이름, 시대, 종류 정보가 손상되었습니다.',
						mission: '세 유물의 정보를 배열 안 객체 형태로 정리하세요.'
					},
					role: {
						title: '고려 유물 담당',
						icon: '🏺',
						description: '고려시대 유물정보를 복구하는 역할'
					},
					clues: [
						'경천사지 10층 석탑은 고려시대 유물이며 종류는 석탑입니다.',
						'청자 상감 구름 학 무늬 매병은 고려시대 유물이며 종류는 도자기입니다.',
						'금속활자는 고려시대 유물이며 종류는 인쇄도구입니다.'
					],
					keyChips: ['유물정보', '이름', '시대', '종류'],
					valueChips: [
						'"경천사지 10층 석탑"',
						'"청자 상감 구름 학 무늬 매병"',
						'"금속활자"',
						'"고려시대"'
					],
					answer: {
						유물정보: [
							{ 이름: '경천사지 10층 석탑', 시대: '고려시대', 종류: '석탑' },
							{
								이름: '청자 상감 구름 학 무늬 매병',
								시대: '고려시대',
								종류: '도자기'
							},
							{ 이름: '금속활자', 시대: '고려시대', 종류: '인쇄도구' }
						]
					}
				},

				joseon: {
					story: {
						call: '조선 유물 담당, 조선시대 유물정보 카드를 복구하세요.',
						summary: '조선시대 유물 3개의 정보가 비어 있습니다.',
						mission: '세 유물의 정보를 배열 안 객체 형태로 정리하세요.'
					},
					role: {
						title: '조선 유물 담당',
						icon: '📜',
						description: '조선시대 유물정보를 복구하는 역할'
					},
					clues: [
						'백자 달항아리는 조선시대 유물이며 종류는 도자기입니다.',
						'단원 풍속도첩은 조선시대 자료이며 종류는 그림입니다.',
						'대동여지도는 조선시대 자료이며 종류는 지도입니다.'
					],
					keyChips: ['유물정보', '이름', '시대', '종류'],
					valueChips: ['"백자 달항아리"', '"단원 풍속도첩"', '"대동여지도"', '"조선시대"'],
					answer: {
						유물정보: [
							{ 이름: '백자 달항아리', 시대: '조선시대', 종류: '도자기' },
							{ 이름: '단원 풍속도첩', 시대: '조선시대', 종류: '그림' },
							{ 이름: '대동여지도', 시대: '조선시대', 종류: '지도' }
						]
					}
				}
			}
		},

		{
			id: 'arrange-exhibition',
			title: '시대별 정보 복구',
			type: 'team-final',
			roleSuccessState: timeMuseumRoleSuccessStates.arrangeExhibition,
			successState: timeMuseumMissionSuccessStates.arrangeExhibition,
			simulationScope: 'room',
			finalSubmitMode: 'full',
			waitForFinalResultCallback: true,
			requireSameFinalSubmissions: true,
			finalMismatchMessage:
				'팀원들의 시대별 복구 JSON이 서로 다릅니다. 회의 후 같은 JSON을 다시 제출하세요.',

			initialJson: `{
  "전시관배치": {
    "선사시대": [],
    "삼국시대": [],
    "고려시대": [],
    "조선시대": []
  }
}`,

			finalAnswer: {
				전시관배치: {
					선사시대: ['주먹도끼', '빗살무늬토기', '반달돌칼'],
					삼국시대: ['금동반가사유상', '가마 인물형 토기', '신라 금관'],
					고려시대: ['경천사지 10층 석탑', '청자 상감 구름 학 무늬 매병', '금속활자'],
					조선시대: ['백자 달항아리', '단원 풍속도첩', '대동여지도']
				}
			},

			roleMissions: {
				prehistory: {
					story: {
						call: '선사 유물 담당, 선사시대 유물 목록을 팀원에게 알려주세요.',
						summary: '선사시대 유물정보 카드가 복구되었습니다.',
						mission: '팀원들과 정보를 합쳐 최종 시대별 복구 JSON을 완성하세요.'
					},
					role: {
						title: '선사 유물 담당',
						icon: '🪨',
						description: '선사시대 유물 목록을 확인하는 역할'
					},
					clues: [
						'선사시대에는 "주먹도끼"가 들어갑니다.',
						'선사시대에는 "빗살무늬토기"가 들어갑니다.',
						'선사시대에는 "반달돌칼"이 들어갑니다.'
					],
					keyChips: ['전시관배치', '선사시대'],
					valueChips: ['"주먹도끼"', '"빗살무늬토기"', '"반달돌칼"']
				},

				threeKingdoms: {
					story: {
						call: '삼국 유물 담당, 삼국시대 유물 목록을 팀원에게 알려주세요.',
						summary: '삼국시대 유물정보 카드가 복구되었습니다.',
						mission: '팀원들과 정보를 합쳐 최종 시대별 복구 JSON을 완성하세요.'
					},
					role: {
						title: '삼국 유물 담당',
						icon: '👑',
						description: '삼국시대 유물 목록을 확인하는 역할'
					},
					clues: [
						'삼국시대에는 "금동반가사유상"이 들어갑니다.',
						'삼국시대에는 "가마 인물형 토기"가 들어갑니다.',
						'삼국시대에는 "신라 금관"이 들어갑니다.'
					],
					keyChips: ['전시관배치', '삼국시대'],
					valueChips: ['"금동반가사유상"', '"가마 인물형 토기"', '"신라 금관"']
				},

				goryeo: {
					story: {
						call: '고려 유물 담당, 고려시대 유물 목록을 팀원에게 알려주세요.',
						summary: '고려시대 유물정보 카드가 복구되었습니다.',
						mission: '팀원들과 정보를 합쳐 최종 시대별 복구 JSON을 완성하세요.'
					},
					role: {
						title: '고려 유물 담당',
						icon: '🏺',
						description: '고려시대 유물 목록을 확인하는 역할'
					},
					clues: [
						'고려시대에는 "경천사지 10층 석탑"이 들어갑니다.',
						'고려시대에는 "청자 상감 구름 학 무늬 매병"이 들어갑니다.',
						'고려시대에는 "금속활자"가 들어갑니다.'
					],
					keyChips: ['전시관배치', '고려시대'],
					valueChips: ['"경천사지 10층 석탑"', '"청자 상감 구름 학 무늬 매병"', '"금속활자"']
				},

				joseon: {
					story: {
						call: '조선 유물 담당, 조선시대 유물 목록을 팀원에게 알려주세요.',
						summary: '조선시대 유물정보 카드가 복구되었습니다.',
						mission: '팀원들과 정보를 합쳐 최종 시대별 복구 JSON을 완성하세요.'
					},
					role: {
						title: '조선 유물 담당',
						icon: '📜',
						description: '조선시대 유물 목록을 확인하는 역할'
					},
					clues: [
						'조선시대에는 "백자 달항아리"가 들어갑니다.',
						'조선시대에는 "단원 풍속도첩"이 들어갑니다.',
						'조선시대에는 "대동여지도"가 들어갑니다.'
					],
					keyChips: ['전시관배치', '조선시대'],
					valueChips: ['"백자 달항아리"', '"단원 풍속도첩"', '"대동여지도"']
				}
			},

			finalSuccessMessage:
				'시대별 정보 복구 성공! 국립중앙박물관 유물정보관리시스템이 정상으로 돌아왔습니다.'
		}
	],

	completion: {
		badge: 'MUSEUM DATA RESTORED',
		title: '유물정보 복구 작전 완료!',
		subtitle: '팀의 JSON 데이터로 국립중앙박물관 유물정보관리시스템을 복구했습니다.',
		summaryTitle: '최종 결과',
		summary: '틀린 부분 확인, 유물정보 카드 복구, 시대별 정보 복구까지 모든 단계가 완료되었습니다.',
		primaryButtonText: '홈으로'
	}
};
