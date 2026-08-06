// src/lib/components/workplace/theme/owlBus/owlBusCourse.js

export const owlBusCourse = {
	id: 'owlBus',
	title: '올빼미버스 기획단: 우리 모둠 노선을 만들자',
	subtitle: '각자 다른 밤 교통 자료를 살펴보고, 모둠이 토의해 심야버스 노선을 만들어 보세요!',
	icon: '🚌',
	themeId: 'owlBus',
	difficulty: 'JSON 고수',
	isRealData: true,
	categoryId: 'read',
	categoryTitle: '제이슨 해석',
	mode: 'read',

	intro: {
		badge: 'NIGHT BUS BRIEFING',
		title: '올빼미버스 기획단 출동!',
		subtitle: '늦은 밤 이동하는 사람들을 위한 심야버스 노선을 만들어야 합니다.',

		image: '/images/themes/owl-bus/intro.png',
		imageAlt: '밤의 서울 지도에서 심야버스 노선을 정하는 모습',

		summaryTitle: '현재 상황',
		summary:
			'밤에는 지하철과 일반 버스가 끊겨 이동이 어려운 사람들이 있습니다. 기획단에는 밤에 머무는 사람, 지역 사이를 이동하는 사람, 서울 밖에서 들어오는 사람에 관한 자료가 도착했습니다. 자료가 나뉘어 있기 때문에 모둠원이 각자 살펴보고 의견을 모아야 합니다.',

		goalTitle: '우리의 임무',
		missionGoal:
			'각자 맡은 JSON 자료에서 심야버스가 필요해 보이는 지역을 한 곳 고릅니다. 모둠원들의 추천과 근거를 비교한 뒤 우리 모둠만의 올빼미버스 노선을 결정합니다.',

		steps: [
			'내 역할의 JSON 자료 3개를 살펴봅니다.',
			'심야버스가 필요해 보이는 지역을 한 곳 고릅니다.',
			'그 지역을 고른 이유를 짧게 적습니다.',
			'모둠원들의 추천 지역과 이유를 듣습니다.',
			'토의해서 우리 모둠의 노선을 결정합니다.'
		],

		tip: '정해진 정답은 없습니다. 자료에 나온 지역과 수치를 근거로 의견을 말하면 됩니다.',

		buttonText: '밤 교통 조사 시작하기'
	},

	completion: {
		icon: '🌙',
		badge: '모둠 노선 완성',
		title: '우리 모둠 올빼미버스 완성!',

		description: '모둠원이 서로 다른 실제 데이터를 살펴보고 토의해 심야버스 노선을 만들었습니다.',

		resultTitle: '우리 모둠의 심야버스 노선',
		result: '모둠이 토의해 결정한 노선',

		reasons: [
			'밤에 머무는 사람 수를 살펴봄',
			'지역 사이를 이동하는 사람 수를 살펴봄',
			'서울 밖에서 들어오는 사람 수를 살펴봄',
			'여러 의견을 비교해 모둠 노선을 결정함'
		],

		message: '하나의 정답을 찾은 것이 아니라 실제 데이터를 근거로 우리 모둠의 노선을 만들었습니다!',

		exitButtonText: '완료하기'
	},

	roles: [
		{
			id: 'night',
			name: '민서',
			roleName: '밤 인구 조사원',
			avatarSrc: '/images/avatars/1.png'
		},
		{
			id: 'movement',
			name: '준호',
			roleName: '지역 이동 조사원',
			avatarSrc: '/images/avatars/2.png'
		},
		{
			id: 'inflow',
			name: '서연',
			roleName: '외부 방문 조사원',
			avatarSrc: '/images/avatars/3.png'
		},
		{
			id: 'route',
			name: '도윤',
			roleName: '후보 지역 조사원',
			avatarSrc: '/images/avatars/4.png'
		}
	],

	missions: [
		{
			id: 'role-analysis',
			title: '내 자료에서 추천 지역 찾기',
			type: 'role-analysis',

			question: '세 지역의 자료를 비교하고, 심야버스가 필요해 보이는 지역 한 곳을 골라보세요.',

			initialJson: `{
  "추천지역": "",
  "추천이유": ""
}`,

			roleMissions: {
				night: {
					story: {
						title: '밤에 머무는 사람이 많은 지역',
						call: '밤 인구 조사원님, 밤에 버스가 필요해 보이는 지역을 골라주세요.',

						summary: '야간인구수는 밤 7시부터 다음 날 아침 8시까지 그 지역에 머무는 사람 수입니다.',

						mission: '세 지역을 비교해 한 곳을 고르고, 야간인구수를 근거로 이유를 적으세요.'
					},

					role: {
						title: '밤 인구 조사원',
						icon: '🌙',
						description: '밤에 머무는 사람 수를 비교하는 역할'
					},

					answerFields: [
						{
							key: '추천지역',
							label: '심야버스가 필요해 보이는 지역 한 곳은 어디인가요?'
						},
						{
							key: '추천이유',
							label: '야간인구수를 보고 고른 이유를 짧게 쓰세요.',
							multiline: true
						}
					],

					clues: [
						{
							type: 'json',
							title: '밤에 머무는 사람 자료',
							data: {
								야간인구상위지역: [
									{
										자치구: '강남구',
										야간인구수: 762333
									},
									{
										자치구: '송파구',
										야간인구수: 746527
									},
									{
										자치구: '강동구',
										야간인구수: 556203
									}
								],
								쉬운설명: '숫자가 클수록 밤에 그 지역에 머무는 사람이 많습니다.'
							}
						}
					],

					keyChips: ['자치구', '야간인구수']
				},

				movement: {
					story: {
						title: '지역 사이 이동이 많은 곳',
						call: '지역 이동 조사원님, 심야버스로 연결하면 좋을 지역을 골라주세요.',

						summary: '자치구간이동인구수는 한 자치구에서 다른 자치구로 이동한 사람 수입니다.',

						mission: '세 지역을 비교해 한 곳을 고르고, 이동한 사람 수를 근거로 이유를 적으세요.'
					},

					role: {
						title: '지역 이동 조사원',
						icon: '🔁',
						description: '다른 지역으로 이동한 사람 수를 비교하는 역할'
					},

					answerFields: [
						{
							key: '추천지역',
							label: '심야버스로 연결하면 좋을 지역 한 곳은 어디인가요?'
						},
						{
							key: '추천이유',
							label: '이동한 사람 수를 보고 고른 이유를 짧게 쓰세요.',
							multiline: true
						}
					],

					clues: [
						{
							type: 'json',
							title: '지역 사이 이동 자료',
							data: {
								자치구간이동상위지역: [
									{
										자치구: '강남구',
										자치구간이동인구수: 343594
									},
									{
										자치구: '서초구',
										자치구간이동인구수: 228172
									},
									{
										자치구: '영등포구',
										자치구간이동인구수: 181704
									}
								],
								쉬운설명: '숫자가 클수록 다른 지역으로 이동한 사람이 많습니다.'
							}
						}
					],

					keyChips: ['자치구', '자치구간이동인구수']
				},

				inflow: {
					story: {
						title: '서울 밖에서 오는 사람이 많은 곳',
						call: '외부 방문 조사원님, 늦은 밤 교통이 필요해 보이는 지역을 골라주세요.',

						summary: '서울외유입인구수는 서울 밖에서 그 지역으로 들어온 사람 수입니다.',

						mission:
							'세 지역을 비교해 한 곳을 고르고, 서울 밖에서 들어온 사람 수를 근거로 이유를 적으세요.'
					},

					role: {
						title: '외부 방문 조사원',
						icon: '🚉',
						description: '서울 밖에서 들어온 사람 수를 비교하는 역할'
					},

					answerFields: [
						{
							key: '추천지역',
							label: '늦은 밤 교통이 필요해 보이는 지역 한 곳은 어디인가요?'
						},
						{
							key: '추천이유',
							label: '서울 밖에서 들어온 사람 수를 보고 이유를 짧게 쓰세요.',
							multiline: true
						}
					],

					clues: [
						{
							type: 'json',
							title: '서울 밖에서 들어온 사람 자료',
							data: {
								서울외유입상위지역: [
									{
										자치구: '강남구',
										서울외유입인구수: 218040
									},
									{
										자치구: '송파구',
										서울외유입인구수: 114543
									},
									{
										자치구: '영등포구',
										서울외유입인구수: 102565
									}
								],
								쉬운설명: '숫자가 클수록 서울 밖에서 그 지역으로 들어온 사람이 많습니다.'
							}
						}
					],

					keyChips: ['자치구', '서울외유입인구수']
				},

				route: {
					story: {
						title: '심야버스 후보 지역 살펴보기',
						call: '후보 지역 조사원님, 심야버스 노선에 넣으면 좋을 지역을 골라주세요.',

						summary: '이 자료는 여러 인구 자료를 함께 살펴본 후보 지역입니다.',

						mission: '세 지역의 판단을 읽고 한 곳을 골라 추천 이유를 적으세요.'
					},

					role: {
						title: '후보 지역 조사원',
						icon: '🚌',
						description: '여러 자료를 함께 살펴본 후보 지역을 비교하는 역할'
					},

					answerFields: [
						{
							key: '추천지역',
							label: '노선에 넣으면 좋을 지역 한 곳은 어디인가요?'
						},
						{
							key: '추천이유',
							label: '판단 내용을 보고 고른 이유를 짧게 쓰세요.',
							multiline: true
						}
					],

					clues: [
						{
							type: 'json',
							title: '심야버스 후보 지역 자료',
							data: {
								핵심지역후보: [
									{
										자치구: '강남구',
										판단: '세 지표 모두 높아 심야버스 핵심 지역으로 볼 수 있음'
									},
									{
										자치구: '영등포구',
										판단: '이동과 유입이 많아 서남권 연결 지역으로 볼 수 있음'
									},
									{
										자치구: '마포구',
										판단: '상권과 야간 활동이 있는 서북권 연결 후보'
									}
								],
								쉬운설명: '판단을 읽고 우리 모둠 노선에 필요해 보이는 지역을 고릅니다.'
							}
						}
					],

					keyChips: ['자치구', '판단']
				}
			}
		},

		{
			id: 'route-report',
			title: '우리 모둠 올빼미버스 만들기',
			type: 'role-analysis',

			question: '각자 추천한 지역과 이유를 듣고, 우리 모둠의 심야버스 노선을 정하세요.',

			initialJson: `{
  "우리모둠노선": [],
  "노선을정한이유": ""
}`,

			answerFields: [
				{
					key: '우리모둠노선',
					label: '모둠이 정한 지역을 버스가 지나갈 순서대로 배열에 쓰세요.',
					multiline: true
				},
				{
					key: '노선을정한이유',
					label: '왜 이 지역들을 연결했는지 모둠의 생각을 한두 문장으로 쓰세요.',
					multiline: true
				}
			],

			supportGuideForThreePlayers: {
				title: '교통센터 지원 의견',
				description: '3명 방에서는 빠진 역할을 대신해 교통센터가 다음 의견을 제공합니다.',

				items: [
					'강남구는 여러 인구 자료에서 높은 수치를 보였습니다.',
					'영등포구는 지역 사이 이동과 서울 밖 유입 자료에 나왔습니다.',
					'자료에 나온 다른 지역을 선택해도 근거가 있으면 됩니다.'
				]
			},

			roleMissions: {
				night: createOwlBusRouteRoleMission(
					'밤에 머무는 사람 자료에서 고른 지역과 이유를 팀원에게 알려주세요.'
				),

				movement: createOwlBusRouteRoleMission(
					'지역 사이 이동 자료에서 고른 지역과 이유를 팀원에게 알려주세요.'
				),

				inflow: createOwlBusRouteRoleMission(
					'서울 밖에서 들어온 사람 자료에서 고른 지역과 이유를 팀원에게 알려주세요.'
				),

				route: createOwlBusRouteRoleMission(
					'후보 지역 자료에서 고른 지역과 이유를 팀원에게 알려주세요.'
				)
			}
		}
	]
};

function createOwlBusRouteRoleMission(call) {
	return {
		story: {
			title: '우리 모둠 심야 노선 토의',
			call,

			summary: '팀원들이 각자 추천한 지역과 이유를 듣고, 어떤 지역을 연결할지 함께 이야기합니다.',

			mission: '정해진 정답을 찾지 말고 모둠의 토의 결과를 JSON으로 작성하세요.'
		},

		role: {
			title: '모둠 심야 노선 토의',
			icon: '💬',
			description: '서로 다른 자료와 의견을 모아 심야버스 노선을 결정하는 역할'
		},

		clues: [
			{
				type: 'json',
				title: '모둠 토의 방법',
				data: {
					토의순서: [
						'각자 추천한 지역을 말합니다.',
						'그 지역을 고른 이유를 설명합니다.',
						'노선에 넣을 지역을 함께 고릅니다.',
						'버스가 지나갈 순서를 정합니다.'
					],
					조건: [
						'지역을 2곳 이상 넣습니다.',
						'자료에 나온 지역을 사용합니다.',
						'모둠이 이야기해서 결정합니다.'
					],
					안내: '모둠마다 다른 노선을 만들어도 됩니다.'
				}
			}
		],

		keyChips: ['우리모둠노선', '노선을정한이유']
	};
}
