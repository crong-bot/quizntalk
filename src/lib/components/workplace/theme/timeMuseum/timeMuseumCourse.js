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

const mission1Answers = {
	prehistory: {
		오류종류: '이름 오류'
	},
	threeKingdoms: {
		오류종류: '시대 오류'
	},
	goryeo: {
		오류종류: '종류 오류'
	},
	joseon: {
		오류종류: '배치 오류'
	}
};

const mission3Values = {
	선사시대: '주먹도끼',
	삼국시대: '장신구',
	고려시대: '청자 매병',
	조선시대: '대동여지도'
};

function createRestoreCommandJson(commandKey, filledPeriod, filledValue) {
	const values = {
		선사시대: '',
		삼국시대: '',
		고려시대: '',
		조선시대: '',
		[filledPeriod]: filledValue
	};

	return JSON.stringify(
		{
			[commandKey]: values
		},
		null,
		2
	);
}

export const timeMuseumCourse = {
	id: 'time-museum',
	title: '유물정보 복구 작전',
	subtitle: '국립중앙박물관 실제 유물 정보를 JSON으로 정리해 전시 시스템을 복구하세요.',
	source: {
		label: '국립중앙박물관',
		description:
			'본 미션에 사용된 유물 이미지와 유물 정보는 국립중앙박물관 누리집의 자료를 활용하였습니다. 해당 저작물은 국립중앙박물관 누리집(홈페이지)(https://www.museum.go.kr)에서 무료로 다운받으실 수 있습니다',
		url: '해당 출처 페이지 주소'
	},
	icon: '🏛️',
	themeId: 'timeMuseum',
	difficulty: 'JSON 입문',
	isRealData: true,
	categoryId: 'write',
	categoryTitle: '제이슨 작성',
	mode: 'write',

	intro: {
		badge: 'MUSEUM DATA SYSTEM',
		title: '국립중앙박물관 유물정보 복구 작전',
		subtitle: '잘못된 유물정보를 찾아 박물관 시스템을 복구하세요.',
		image: '/images/themes/timeMuseum/gilt-bronze-pensive-bodhisattva.png',
		imageAlt: '국립중앙박물관 유물정보관리시스템 오류 화면',
		summaryTitle: '현재 상황',
		summary:
			'시대별 유물정보에 서로 다른 오류가 발생했습니다. 각 담당자는 자기 시대의 오류를 찾고 유물정보를 복구해야 합니다.',
		goalTitle: '우리의 임무',
		missionGoal:
			'자기 시대의 오류를 찾고 유물정보 카드를 복구한 뒤, 팀원들의 결과를 모아 전체 복구명령을 완성하세요.',
		steps: [
			'미션 1에서 자기 시대에 발생한 오류 종류 하나를 찾습니다.',
			'미션 2에서 자기 시대의 유물정보 카드를 복구합니다.',
			'미션 3에서 팀원들의 결과를 모아 전체 시대 복구명령을 완성합니다.'
		],
		tip: '미션 3에서는 자기 시대의 값이 먼저 들어 있습니다. 나머지는 팀원에게 물어보세요.',
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
		// =====================================================
		// 미션 1: 자기 시대의 오류 하나 찾기
		// =====================================================
		{
			id: 'diagnose-system',
			title: '내 시대의 오류 찾기',
			type: 'individual',
			roleSuccessState: timeMuseumRoleSuccessStates.diagnoseSystem,
			successState: timeMuseumMissionSuccessStates.diagnoseSystem,
			simulationScope: 'local',

			initialJson: `{
  "오류종류": ""
}`,

			roleMissions: {
				prehistory: {
					story: {
						call: '선사시대 유물정보에서 무엇이 잘못되었는지 찾으세요.',
						summary: '선사시대 유물 카드에는 한 종류의 오류가 있습니다.',
						mission: '"오류종류"에 찾은 오류를 작성하세요.'
					},

					role: {
						title: '선사 유물 담당',
						icon: '🪨',
						description: '선사시대 유물정보의 오류를 찾는 역할'
					},

					clues: ['사진과 유물 이름을 비교해 보세요.', '잘못된 항목의 이름만 작성하면 됩니다.'],

					keyChips: ['오류종류'],

					valueChips: ['"이름 오류"', '"시대 오류"', '"종류 오류"', '"배치 오류"'],

					answer: mission1Answers.prehistory
				},

				threeKingdoms: {
					story: {
						call: '삼국시대 유물정보에서 무엇이 잘못되었는지 찾으세요.',
						summary: '삼국시대 유물 카드에는 한 종류의 오류가 있습니다.',
						mission: '"오류종류"에 찾은 오류를 작성하세요.'
					},

					role: {
						title: '삼국 유물 담당',
						icon: '👑',
						description: '삼국시대 유물정보의 오류를 찾는 역할'
					},

					clues: ['유물에 표시된 시대를 비교해 보세요.', '잘못된 항목의 이름만 작성하면 됩니다.'],

					keyChips: ['오류종류'],

					valueChips: ['"이름 오류"', '"시대 오류"', '"종류 오류"', '"배치 오류"'],

					answer: mission1Answers.threeKingdoms
				},

				goryeo: {
					story: {
						call: '고려시대 유물정보에서 무엇이 잘못되었는지 찾으세요.',
						summary: '고려시대 유물 카드에는 한 종류의 오류가 있습니다.',
						mission: '"오류종류"에 찾은 오류를 작성하세요.'
					},

					role: {
						title: '고려 유물 담당',
						icon: '🏺',
						description: '고려시대 유물정보의 오류를 찾는 역할'
					},

					clues: ['유물의 종류가 알맞은지 비교해 보세요.', '잘못된 항목의 이름만 작성하면 됩니다.'],

					keyChips: ['오류종류'],

					valueChips: ['"이름 오류"', '"시대 오류"', '"종류 오류"', '"배치 오류"'],

					answer: mission1Answers.goryeo
				},

				joseon: {
					story: {
						call: '조선시대 전시관에서 무엇이 잘못되었는지 찾으세요.',
						summary: '조선시대 전시관에는 한 종류의 오류가 있습니다.',
						mission: '"오류종류"에 찾은 오류를 작성하세요.'
					},

					role: {
						title: '조선 유물 담당',
						icon: '📜',
						description: '조선시대 전시관의 오류를 찾는 역할'
					},

					clues: [
						'유물이 알맞은 시대 전시관에 놓였는지 살펴보세요.',
						'잘못된 항목의 이름만 작성하면 됩니다.'
					],

					keyChips: ['오류종류'],

					valueChips: ['"이름 오류"', '"시대 오류"', '"종류 오류"', '"배치 오류"'],

					answer: mission1Answers.joseon
				}
			}
		},

		// =====================================================
		// 미션 2: 틀린 유물 하나만 수정
		// =====================================================
		{
			id: 'restore-relic-cards',
			title: '잘못된 유물정보 수정하기',
			type: 'individual',

			roleSuccessState: timeMuseumRoleSuccessStates.restoreRelicCards,

			successState: timeMuseumMissionSuccessStates.restoreRelicCards,

			simulationScope: 'local',

			initialJson: `{
  "담당시대": "",
  "수정유물": {
    "이름": "",
    "종류": ""
  }
}`,

			roleMissions: {
				prehistory: {
					story: {
						call: '잘못된 선사시대 유물정보를 정상 데이터로 수정하세요.',
						summary: '틀린 유물 하나만 올바르게 수정하면 됩니다.',
						mission: '수정할 유물의 이름과 종류를 "수정유물" 객체에 작성하세요.'
					},

					role: {
						title: '선사 유물 담당',
						icon: '🪨',
						description: '잘못된 선사시대 유물정보 하나를 수정합니다.'
					},

					clues: ['수정해야 할 유물: 주먹도끼', '정상 이름: 주먹도끼', '정상 종류: 석기'],

					keyChips: ['담당시대', '수정유물', '이름', '종류'],

					valueChips: ['"선사시대"', '"주먹도끼"', '"석기"'],

					answer: {
						담당시대: '선사시대',
						수정유물: {
							이름: '주먹도끼',
							종류: '석기'
						}
					}
				},

				threeKingdoms: {
					story: {
						call: '잘못된 삼국시대 유물정보를 정상 데이터로 수정하세요.',
						summary: '틀린 유물 하나만 올바르게 수정하면 됩니다.',
						mission: '수정할 유물의 이름과 종류를 "수정유물" 객체에 작성하세요.'
					},

					role: {
						title: '삼국 유물 담당',
						icon: '👑',
						description: '잘못된 삼국시대 유물정보 하나를 수정합니다.'
					},

					clues: ['수정해야 할 유물: 신라 금관', '정상 이름: 신라 금관', '정상 종류: 장신구'],

					keyChips: ['담당시대', '수정유물', '이름', '종류'],

					valueChips: ['"삼국시대"', '"신라 금관"', '"장신구"'],

					answer: {
						담당시대: '삼국시대',
						수정유물: {
							이름: '신라 금관',
							종류: '장신구'
						}
					}
				},

				goryeo: {
					story: {
						call: '잘못된 고려시대 유물정보를 정상 데이터로 수정하세요.',
						summary: '틀린 유물 하나만 올바르게 수정하면 됩니다.',
						mission: '수정할 유물의 이름과 종류를 "수정유물" 객체에 작성하세요.'
					},

					role: {
						title: '고려 유물 담당',
						icon: '🏺',
						description: '잘못된 고려시대 유물정보 하나를 수정합니다.'
					},

					clues: ['수정해야 할 유물: 청자 매병', '정상 이름: 청자 매병', '정상 종류: 도자기'],

					keyChips: ['담당시대', '수정유물', '이름', '종류'],

					valueChips: ['"고려시대"', '"청자 매병"', '"도자기"'],

					answer: {
						담당시대: '고려시대',
						수정유물: {
							이름: '청자 매병',
							종류: '도자기'
						}
					}
				},

				joseon: {
					story: {
						call: '잘못 배치된 조선시대 유물을 정상 데이터로 수정하세요.',
						summary: '조선시대 전시관에 들어가야 할 유물 하나를 올바르게 복구합니다.',
						mission: '정상 유물의 이름과 종류를 "수정유물" 객체에 작성하세요.'
					},

					role: {
						title: '조선 유물 담당',
						icon: '📜',
						description: '잘못 배치된 조선시대 유물을 정상 상태로 복구합니다.'
					},

					clues: ['정상 유물: 대동여지도', '정상 이름: 대동여지도', '정상 종류: 지도'],

					keyChips: ['담당시대', '수정유물', '이름', '종류'],

					valueChips: ['"조선시대"', '"대동여지도"', '"지도"'],

					answer: {
						담당시대: '조선시대',
						수정유물: {
							이름: '대동여지도',
							종류: '지도'
						}
					}
				}
			}
		},

		// =====================================================
		// 미션 3: 팀원들의 복구명령을 합치는 최종 미션
		// =====================================================
		{
			id: 'arrange-exhibition',
			title: '전체 복구명령 완성',
			type: 'team-final',
			roleSuccessState: timeMuseumRoleSuccessStates.arrangeExhibition,
			successState: timeMuseumMissionSuccessStates.arrangeExhibition,
			simulationScope: 'room',

			/*
			 * finalSubmitMode: 'full'을 사용하지 않는다.
			 * 기본 pieces 방식으로 각 역할의 서로 다른 키를 합친다.
			 */
			waitForFinalResultCallback: true,

			roleMissions: {
				prehistory: {
					initialJson: createRestoreCommandJson('복구명령-01', '선사시대', mission3Values.선사시대),

					story: {
						call: '복구명령 01을 완성하세요.',
						summary: '선사시대 복구값은 이미 들어 있습니다.',
						mission: '팀원에게 나머지 값을 물어보고 네 시대의 복구명령을 완성하세요.'
					},

					role: {
						title: '복구명령 01 담당',
						icon: '🪨',
						description: '전체 시대 복구명령 01을 완성하는 역할'
					},

					clues: [
						'선사시대 복구값: 주먹도끼',
						'삼국·고려·조선시대의 복구값은 팀원에게 물어보세요.'
					],

					keyChips: ['복구명령-01', '선사시대', '삼국시대', '고려시대', '조선시대'],

					valueChips: ['"주먹도끼"']
				},

				threeKingdoms: {
					initialJson: createRestoreCommandJson('복구명령-02', '삼국시대', mission3Values.삼국시대),

					story: {
						call: '복구명령 02를 완성하세요.',
						summary: '삼국시대 복구값은 이미 들어 있습니다.',
						mission: '팀원에게 나머지 값을 물어보고 네 시대의 복구명령을 완성하세요.'
					},

					role: {
						title: '복구명령 02 담당',
						icon: '👑',
						description: '전체 시대 복구명령 02를 완성하는 역할'
					},

					clues: ['삼국시대 복구값: 장신구', '선사·고려·조선시대의 복구값은 팀원에게 물어보세요.'],

					keyChips: ['복구명령-02', '선사시대', '삼국시대', '고려시대', '조선시대'],

					valueChips: ['"장신구"']
				},

				goryeo: {
					initialJson: createRestoreCommandJson('복구명령-03', '고려시대', mission3Values.고려시대),

					story: {
						call: '복구명령 03을 완성하세요.',
						summary: '고려시대 복구값은 이미 들어 있습니다.',
						mission: '팀원에게 나머지 값을 물어보고 네 시대의 복구명령을 완성하세요.'
					},

					role: {
						title: '복구명령 03 담당',
						icon: '🏺',
						description: '전체 시대 복구명령 03을 완성하는 역할'
					},

					clues: [
						'고려시대 복구값: 청자 매병',
						'선사·삼국·조선시대의 복구값은 팀원에게 물어보세요.'
					],

					keyChips: ['복구명령-03', '선사시대', '삼국시대', '고려시대', '조선시대'],

					valueChips: ['"청자 매병"']
				},

				joseon: {
					initialJson: createRestoreCommandJson('복구명령-04', '조선시대', mission3Values.조선시대),

					story: {
						call: '복구명령 04를 완성하세요.',
						summary: '조선시대 복구값은 이미 들어 있습니다.',
						mission: '팀원에게 나머지 값을 물어보고 네 시대의 복구명령을 완성하세요.'
					},

					role: {
						title: '복구명령 04 담당',
						icon: '📜',
						description: '전체 시대 복구명령 04를 완성하는 역할'
					},

					clues: [
						'조선시대 복구값: 대동여지도',
						'선사·삼국·고려시대의 복구값은 팀원에게 물어보세요.'
					],

					keyChips: ['복구명령-04', '선사시대', '삼국시대', '고려시대', '조선시대'],

					valueChips: ['"대동여지도"']
				}
			},

			finalSuccessMessage:
				'전체 복구명령 전송 성공! 국립중앙박물관 유물정보관리시스템이 정상으로 돌아왔습니다.'
		}
	],

	completion: {
		badge: 'MUSEUM DATA RESTORED',
		title: '유물정보 복구 작전 완료!',
		subtitle: '팀의 복구명령으로 국립중앙박물관 유물정보관리시스템을 복구했습니다.',
		summaryTitle: '최종 결과',
		summary: '오류 찾기, 유물정보 카드 복구, 전체 복구명령 전송까지 모든 단계가 완료되었습니다.',
		primaryButtonText: '홈으로'
	}
};
