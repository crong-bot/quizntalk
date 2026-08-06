// src/lib/components/workplace/theme/disasterSafety/disasterSafetyCourse.js

export const disasterSafetyCourse = {
	id: 'disasterSafety',
	title: '폭우 구조대: 먼저 출동할 곳을 찾아라',
	subtitle: '각자 재난 JSON 단서를 찾고, 구조대의 출동 계획을 함께 완성해 보세요!',
	icon: '🚨',
	themeId: 'disasterSafety',
	difficulty: 'JSON 입문',
	isRealData: true,
	categoryId: 'read',
	categoryTitle: '제이슨 해석',
	mode: 'read',

	intro: {
		badge: 'DISASTER BRIEFING',
		title: '폭우 구조대 긴급 출동!',
		subtitle: '큰비가 오기 전, 구조대가 먼저 살펴볼 곳을 찾아야 합니다.',
		image: '/images/themes/disaster/base.png',
		imageAlt: '재난안전 구조대가 폭우 위험 지역을 확인하는 장면',

		summaryTitle: '현재 상황',
		summary:
			'곧 큰비가 올 수 있다는 예보가 들어왔습니다. 재난안전본부에는 위험 종류, 출동 지역, 침수 장소, 침수 원인에 관한 JSON 자료가 도착했습니다. 자료가 나뉘어 있어 모둠원이 각자 단서를 찾고 함께 출동 계획을 세워야 합니다.',

		goalTitle: '우리의 임무',
		missionGoal:
			'미션 1에서는 각자 맡은 JSON에서 출동 계획에 필요한 단서를 하나씩 찾습니다. 미션 2에서는 네 가지 단서를 순서대로 연결해 구조대가 먼저 출동할 곳을 정합니다.',

		steps: [
			'내 역할의 JSON을 읽습니다.',
			'질문에 필요한 키와 값을 찾습니다.',
			'찾은 단서를 제출합니다.',
			'모둠원들이 찾은 단서를 순서대로 연결합니다.',
			'구조대의 출동 계획 JSON을 완성합니다.'
		],

		tip: '힌트: 위험 종류, 지역, 장소, 원인 단서를 차례대로 연결하면 출동할 곳을 찾을 수 있습니다.',

		buttonText: '폭우 구조작전 시작하기'
	},

	completion: {
		icon: '🚒',
		badge: '구조작전 완료',
		title: '구조대 출동 계획 완성!',
		description: '모둠원이 JSON 단서를 연결해 구조대가 먼저 살펴볼 곳을 결정했습니다.',

		resultTitle: '먼저 살펴볼 곳',
		result: '강서구 화곡1지구와 화곡2지구',

		reasons: [
			'침수위험이 붕괴위험보다 많이 나타남',
			'강서구에는 침수위험 장소 자료가 많음',
			'화곡1지구는 배수능력 부족 문제가 있음',
			'화곡2지구는 낮은 곳이라 비물이 모일 수 있음'
		],

		message: '팀의 JSON 단서를 연결해 구조대의 출동 계획을 완성했습니다!',
		exitButtonText: '완료하기'
	},

	roles: [
		{
			id: 'type',
			name: '민서',
			roleName: '위험 종류 분석 대원',
			avatarSrc: '/images/avatars/1.png'
		},
		{
			id: 'district',
			name: '준호',
			roleName: '출동 지역 분석 대원',
			avatarSrc: '/images/avatars/2.png'
		},
		{
			id: 'flood',
			name: '서연',
			roleName: '침수 장소 분석 대원',
			avatarSrc: '/images/avatars/3.png'
		},
		{
			id: 'priority',
			name: '도윤',
			roleName: '침수 원인 분석 대원',
			avatarSrc: '/images/avatars/4.png'
		}
	],

	missions: [
		{
			id: 'personal-disaster-analysis',
			title: '출동 계획에 필요한 단서 찾기',
			type: 'role-analysis',

			question: '내 역할의 JSON을 읽고 구조대의 출동 계획에 필요한 단서를 찾아보세요.',

			initialJson: `{}`,

			roleMissions: {
				type: {
					story: {
						title: '가장 주의할 위험 찾기',
						call: '위험 종류 분석 대원님, 더 많이 나타난 위험 종류를 찾아주세요.',
						summary: '위험종류 배열에서 침수위험과 붕괴위험의 개수를 비교합니다.',
						mission: '개수가 더 많은 위험 종류와 그 개수를 제출하세요.'
					},

					role: {
						title: '위험 종류 분석 대원',
						icon: '⚠️',
						description: '위험 종류별 개수를 비교해 가장 주의할 위험을 찾는 역할'
					},

					answerFields: [
						{
							key: '위험종류',
							label: '개수가 더 많은 위험 종류는 무엇인가요?'
						},
						{
							key: '개수',
							label: '그 위험은 몇 개 나타났나요?'
						}
					],

					clues: [
						{
							type: 'json',
							title: '위험 종류 JSON',
							data: {
								위험종류: [
									{
										종류: '침수위험',
										개수: 4
									},
									{
										종류: '붕괴위험',
										개수: 3
									}
								],
								찾을것: '개수가 더 큰 위험 종류'
							}
						}
					],

					keyChips: ['종류', '개수']
				},

				district: {
					story: {
						title: '먼저 살펴볼 지역 찾기',
						call: '출동 지역 분석 대원님, 침수위험 장소 자료가 많은 지역을 찾아주세요.',
						summary:
							'출동판단단서 배열에서 각 지역의 특징을 읽고, 침수위험 장소 자료가 많은 지역을 찾습니다.',
						mission: '침수위험 장소 자료가 많은 지역과 그 특징을 제출하세요.'
					},

					role: {
						title: '출동 지역 분석 대원',
						icon: '🗺️',
						description: '지역과 특징을 연결해 먼저 살펴볼 지역을 찾는 역할'
					},

					answerFields: [
						{
							key: '출동지역',
							label: '침수위험 장소 자료가 많은 지역은 어디인가요?'
						},
						{
							key: '지역특징',
							label: '그 지역의 특징은 무엇인가요?'
						}
					],

					clues: [
						{
							type: 'json',
							title: '출동 지역 단서 JSON',
							data: {
								출동판단단서: [
									{
										지역: '서초구',
										특징: '위험한 곳의 수가 가장 많음'
									},
									{
										지역: '강서구',
										특징: '침수위험 장소 자료가 많음'
									},
									{
										지역: '양천구',
										특징: '내수침수 위험이 있음'
									}
								],
								찾을것: '침수위험 장소 자료가 많은 지역'
							}
						}
					],

					keyChips: ['지역', '특징']
				},

				flood: {
					story: {
						title: '강서구 침수 장소 찾기',
						call: '침수 장소 분석 대원님, 강서구에 있는 침수위험 장소를 찾아주세요.',
						summary: '침수위험장소 배열에서 지역 값이 강서구인 객체를 찾습니다.',
						mission: '강서구에 있는 침수위험 장소를 제출하세요.'
					},

					role: {
						title: '침수 장소 분석 대원',
						icon: '📍',
						description: '지역 값을 보고 강서구의 침수위험 장소를 찾는 역할'
					},

					answerFields: [
						{
							key: '침수장소',
							label: '강서구에 있는 침수위험 장소는 어디인가요?'
						}
					],

					clues: [
						{
							type: 'json',
							title: '침수위험 장소 JSON',
							data: {
								침수위험장소: [
									{
										장소: '신월신정동지구',
										지역: '양천구'
									},
									{
										장소: '화곡1지구',
										지역: '강서구'
									},
									{
										장소: '화곡2지구',
										지역: '강서구'
									},
									{
										장소: '서초지구',
										지역: '서초구'
									}
								],
								찾을것: '지역 값이 강서구인 장소'
							}
						}
					],

					keyChips: ['장소', '지역']
				},

				priority: {
					story: {
						title: '화곡지구 침수 원인 찾기',
						call: '침수 원인 분석 대원님, 화곡1지구와 화곡2지구가 위험한 이유를 찾아주세요.',
						summary: '침수원인 배열에서 각 장소와 위험한이유 값을 연결해 읽습니다.',
						mission: '화곡1지구와 화곡2지구가 위험한 이유를 제출하세요.'
					},

					role: {
						title: '침수 원인 분석 대원',
						icon: '🌧️',
						description: '장소와 침수 원인을 연결해 읽는 역할'
					},

					sideClues: [
						'배수는 물을 밖으로 빼내는 것을 뜻해요.',
						'낮은 곳에는 빗물이 모이기 쉬워요.'
					],

					answerFields: [
						{
							key: '화곡1지구원인',
							label: '화곡1지구가 위험한 이유는 무엇인가요?'
						},
						{
							key: '화곡2지구원인',
							label: '화곡2지구가 위험한 이유는 무엇인가요?'
						}
					],

					clues: [
						{
							type: 'json',
							title: '화곡지구 침수 원인 JSON',
							data: {
								침수원인: [
									{
										장소: '화곡1지구',
										위험한이유: '배수능력 부족으로 침수피해가 생길 수 있음'
									},
									{
										장소: '화곡2지구',
										위험한이유: '낮은 곳이라 비물이 한곳으로 모일 수 있음'
									}
								],
								찾을것: '각 장소의 위험한이유'
							}
						}
					],

					keyChips: ['장소', '위험한이유']
				}
			}
		},

		{
			id: 'team-disaster-report',
			title: '팀 단서로 출동 계획 완성하기',
			type: 'team-json-report',

			question: '팀원들이 찾은 위험 종류, 지역, 장소, 원인을 모아 구조대의 출동 계획을 완성하세요.',

			answerFields: [
				{
					key: '먼저출동할곳',
					label: '구조대가 먼저 출동해야 할 곳은 어디인가요?'
				},
				{
					key: '위험종류',
					label: '가장 주의해야 할 위험 종류는 무엇인가요?'
				},
				{
					key: '출동이유',
					label: '팀이 찾은 출동 이유를 배열로 작성하세요.',
					multiline: true
				}
			],

			initialJson: `{
  "먼저출동할곳": "",
  "위험종류": "",
  "출동이유": []
}`,

			sourceMissionId: 'personal-disaster-analysis',
			sourceAnswerTitle: '팀이 찾은 출동 단서',

			roleMissions: {
				type: createTeamDisasterReportRoleMission(
					'가장 주의해야 할 위험 종류와 개수를 팀원에게 알려주세요.'
				),

				district: createTeamDisasterReportRoleMission(
					'침수위험 장소 자료가 많은 지역과 특징을 팀원에게 알려주세요.'
				),

				flood: createTeamDisasterReportRoleMission(
					'강서구에서 찾은 침수위험 장소를 팀원에게 알려주세요.'
				),

				priority: createTeamDisasterReportRoleMission(
					'화곡1지구와 화곡2지구의 침수 원인을 팀원에게 알려주세요.'
				)
			}
		}
	]
};

function createTeamDisasterReportRoleMission(call) {
	return {
		story: {
			title: '구조대 출동 계획 완성',
			call,

			summary:
				'미션 1에서 찾은 위험 종류, 출동 지역, 침수 장소, 침수 원인 단서를 순서대로 연결합니다.',

			mission: '팀 단서를 바탕으로 구조대가 먼저 출동해야 할 곳과 출동 이유를 작성하세요.'
		},

		role: {
			title: '구조대 출동 계획 완성',
			icon: '🧩',
			description: '네 가지 JSON 단서를 연결해 구조대의 출동 계획을 완성하는 역할'
		},

		clues: [
			{
				type: 'json',
				title: '지역별 위험한 곳 비교 자료',
				data: {
					지역별위험한곳: [
						{
							지역: '서초구',
							위험한곳수: 4
						},
						{
							지역: '종로구',
							위험한곳수: 2
						},
						{
							지역: '강서구',
							위험한곳수: 1
						}
					],
					확인할점:
						'서초구는 전체 위험한 곳의 수가 가장 많지만, 이번 출동은 큰비와 관련된 침수위험 단서를 중심으로 판단합니다.'
				}
			},

			{
				type: 'json',
				title: '출동 계획 작성 방법 JSON',
				data: {
					작성방법: {
						먼저출동할곳: '출동 지역과 침수위험 장소를 함께 씁니다',
						위험종류: '위험 종류 분석 대원이 찾은 값을 씁니다',
						출동이유: [
							'출동 지역의 특징을 씁니다',
							'화곡1지구의 위험 원인을 씁니다',
							'화곡2지구의 위험 원인을 씁니다'
						]
					}
				}
			}
		],

		keyChips: ['먼저출동할곳', '위험종류', '출동이유']
	};
}
