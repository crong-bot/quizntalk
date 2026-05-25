// src/lib/components/workplace/theme/animalRescue/animalRescueCourse.js

export const animalRescueCourse = {
	id: 'animalRescue',
	title: '동물구조대: 늑구 추적 작전',
	subtitle: '제보들을 모아서 늑구 구조 계획서를 만들어보세요!',
	icon: '🪐',
	themeId: 'animalRescue',
	categoryId: 'read',
	categoryTitle: '제이슨 해석',
	mode: 'read',

	intro: {
		badge: 'RESCUE BRIEFING',
		title: '동물 구조대 긴급 출동',
		subtitle: '흩어진 제보를 모아 동물의 위치와 안전한 구조 방법을 찾아보세요.',
		image: '/images/themes/animal/intro.png',
		imageAlt: '동물 구조대가 제보를 분석하는 장면',
		summaryTitle: '현재 상황',
		summary:
			'동물이 낯선 곳에서 발견되었다는 제보가 들어왔습니다. 하지만 제보 내용은 역할별로 나뉘어 있어, 혼자서는 전체 상황을 알 수 없습니다.',
		goalTitle: '우리의 임무',
		missionGoal:
			'각자 받은 JSON 단서를 읽고 중요한 정보를 분석하세요. 팀원들의 분석을 모아 동물이 어디에 있는지, 어떻게 안전하게 구조할지 계획을 세워야 합니다.',
		steps: [
			'내 역할에 주어진 JSON 단서를 확인합니다.',
			'제보에서 중요한 정보를 찾아 분석합니다.',
			'분석 결과를 제출하고 팀원의 정보를 기다립니다.',
			'모든 분석이 모이면 안전한 구조 계획을 완성합니다.'
		],
		tip: '힌트: 제보 하나만 보고 판단하지 말고, 친구들의 단서까지 모아 근거를 만들어야 해요.',
		buttonText: '구조 작전 시작하기'
	},

	roles: [
		{
			id: 'report',
			name: '민서',
			roleName: '제보 분석 대원',
			avatarSrc: '/images/avatars/1.png'
		},
		{
			id: 'trace',
			name: '준호',
			roleName: '흔적 분석 대원',
			avatarSrc: '/images/avatars/2.png'
		},
		{
			id: 'time',
			name: '서연',
			roleName: '시간·이동 분석 대원',
			avatarSrc: '/images/avatars/3.png'
		},
		{
			id: 'safety',
			name: '도윤',
			roleName: '안전·포획 분석 대원',
			avatarSrc: '/images/avatars/4.png'
		}
	],

	missions: [
		{
			id: 'role-analysis',
			title: '역할별 JSON 단서 분석',
			type: 'role-analysis',

			initialJson: `{
  "분석결과": "",
  "유력장소": "",
  "이유": ""
}`,

			roleMissions: {
				report: {
					story: {
						title: '역할별 JSON 단서 분석',
						call: '제보 분석 대원님, 시민 제보를 확인해 주세요.',
						summary: '목격 제보의 신뢰도, 사진 제보 여부, 목격 내용을 비교해야 합니다.',
						mission: '가장 믿을 만한 장소와 이유를 분석 결과 JSON으로 제출하세요.'
					},
					role: {
						title: '제보 분석 대원',
						icon: '📢',
						description: '목격 제보의 신뢰도와 사진 제보 여부를 분석하는 역할'
					},
					clues: [
						{
							type: 'json',
							title: '제보 JSON 단서',
							data: {
								제보목록: [
									{
										번호: 'A',
										장소: '동물원 뒤편 야산',
										제보자: '관리 직원',
										목격동물: '회색 늑대',
										목격시각: '21:10',
										신뢰도: '높음',
										사진제보: false
									},
									{
										번호: 'B',
										장소: '주택가 골목',
										제보자: '익명',
										목격동물: '큰 개',
										목격시각: '18:30',
										신뢰도: '낮음',
										사진제보: false
									},
									{
										번호: 'C',
										장소: '하천 옆 수로',
										제보자: '산책 중인 시민',
										목격동물: '목줄 없는 회색 동물',
										목격시각: '23:40',
										신뢰도: '높음',
										사진제보: true
									}
								]
							}
						}
					],
					keyChips: []
				},

				trace: {
					story: {
						title: '역할별 JSON 단서 분석',
						call: '흔적 분석 대원님, 현장 흔적을 확인해 주세요.',
						summary: '발자국, 털흔적, 울음소리, 먹이 흔적을 비교해야 합니다.',
						mission: '흔적이 가장 많이 남은 장소와 이유를 분석 결과 JSON으로 제출하세요.'
					},
					role: {
						title: '흔적 분석 대원',
						icon: '🐾',
						description: '발자국, 털흔적, 울음소리, 먹이 흔적을 분석하는 역할'
					},
					clues: [
						{
							type: 'json',
							title: '흔적 JSON 단서',
							data: {
								흔적목록: [
									{
										번호: 'A',
										장소: '동물원 뒤편 야산',
										발자국: true,
										털흔적: false,
										울음소리: false,
										먹이흔적: true
									},
									{
										번호: 'B',
										장소: '주택가 골목',
										발자국: false,
										털흔적: false,
										울음소리: true,
										먹이흔적: false
									},
									{
										번호: 'C',
										장소: '하천 옆 수로',
										발자국: true,
										털흔적: true,
										울음소리: true,
										먹이흔적: true
									}
								]
							}
						}
					],
					keyChips: []
				},

				time: {
					story: {
						title: '역할별 JSON 단서 분석',
						call: '시간·이동 분석 대원님, 늑구의 이동 흐름을 확인해 주세요.',
						summary: '목격 시각과 이전 장소와의 거리, 이동 가능성을 비교해야 합니다.',
						mission: '가장 최근에 목격되었고 이동 흐름이 자연스러운 장소를 제출하세요.'
					},
					role: {
						title: '시간·이동 분석 대원',
						icon: '⏱️',
						description: '목격 시각과 이동 가능성을 분석하는 역할'
					},
					clues: [
						{
							type: 'json',
							title: '시간·이동 JSON 단서',
							data: {
								이동기록: [
									{
										번호: 'A',
										장소: '동물원 뒤편 야산',
										목격시각: '21:10',
										이전장소와거리: 900,
										이동가능성: '가능'
									},
									{
										번호: 'B',
										장소: '주택가 골목',
										목격시각: '18:30',
										이전장소와거리: 300,
										이동가능성: '낮음'
									},
									{
										번호: 'C',
										장소: '하천 옆 수로',
										목격시각: '23:40',
										이전장소와거리: 700,
										이동가능성: '높음'
									}
								]
							}
						}
					],
					keyChips: []
				},

				safety: {
					story: {
						title: '역할별 JSON 단서 분석',
						call: '안전·포획 분석 대원님, 구조대 접근 조건을 확인해 주세요.',
						summary:
							'사람이 많은지, 도로와 가까운지, 은신처와 포획 차량 접근 여부를 비교해야 합니다.',
						mission: '늑구를 안전하게 포획하기 좋은 장소와 이유를 제출하세요.'
					},
					role: {
						title: '안전·포획 분석 대원',
						icon: '🛟',
						description: '구조대 접근 가능성과 포획 안전성을 분석하는 역할'
					},
					clues: [
						{
							type: 'json',
							title: '안전·포획 JSON 단서',
							data: {
								포획환경: [
									{
										번호: 'A',
										장소: '동물원 뒤편 야산',
										사람많음: false,
										도로거리: 800,
										은신처: true,
										포획차량접근: false
									},
									{
										번호: 'B',
										장소: '주택가 골목',
										사람많음: true,
										도로거리: 50,
										은신처: false,
										포획차량접근: true
									},
									{
										번호: 'C',
										장소: '하천 옆 수로',
										사람많음: false,
										도로거리: 300,
										은신처: true,
										포획차량접근: true
									}
								]
							}
						}
					],
					keyChips: []
				}
			}
		},

		{
			id: 'capture-plan',
			title: '최종 포획계획보고서',
			type: 'team-json-report',

			initialJson: `{
  "우선수색지역": "",
  "포획방법": "",
  "필요장비": [],
  "판단근거": []
}`,

			roleMissions: {
				report: createCapturePlanRoleMission(
					'제보 분석 결과를 팀에 공유하고, 최종 포획계획을 작성하세요.'
				),
				trace: createCapturePlanRoleMission(
					'흔적 분석 결과를 팀에 공유하고, 최종 포획계획을 작성하세요.'
				),
				time: createCapturePlanRoleMission(
					'시간·이동 분석 결과를 팀에 공유하고, 최종 포획계획을 작성하세요.'
				),
				safety: createCapturePlanRoleMission(
					'안전·포획 분석 결과를 팀에 공유하고, 최종 포획계획을 작성하세요.'
				)
			}
		}
	]
};

function createCapturePlanRoleMission(call) {
	return {
		story: {
			title: '최종 포획계획보고서',
			call,
			summary: '모둠원의 분석 결과를 종합해 늑구를 어디에서 어떻게 포획할지 정리합니다.',
			mission: '우선수색지역, 포획방법, 필요장비, 판단근거를 JSON으로 작성하세요.'
		},
		role: {
			title: '팀 포획계획 작성',
			icon: '📋',
			description: '모둠의 최종 포획계획을 정리하는 역할'
		},
		clues: [
			{
				type: 'json',
				title: '보고서 예시 JSON',
				data: {
					보고서예시: {
						우선수색지역: 'C',
						포획방법: '하천 옆 산책로에서 조용히 접근한다',
						필요장비: ['포획망', '이동케이지'],
						판단근거: [
							'신뢰도 높은 사진 제보가 있다',
							'발자국과 털흔적이 있다',
							'가장 최근에 목격되었다'
						]
					}
				}
			}
		],
		keyChips: []
	};
}
