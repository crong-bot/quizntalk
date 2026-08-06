// src/lib/components/workplace/theme/bikeRebalance/bikeRebalanceCourse.js

export const bikeRebalanceCourse = {
	id: 'bikeRebalance',
	title: '따릉이 데이터 분석대: 보충 대여소를 찾아라',
	subtitle: '각자 JSON 단서를 찾고, 팀 단서를 모아 따릉이를 먼저 보충해야 할 대여소를 찾아보세요!',
	icon: '🚲',
	themeId: 'bikeRebalance',
	difficulty: 'JSON 입문',
	isRealData: true,
	categoryId: 'read',
	categoryTitle: '제이슨 해석',
	mode: 'read',

	intro: {
		badge: 'DATA BRIEFING',
		title: '따릉이 보충 작전 시작',
		subtitle: '흩어진 JSON 단서를 모아 따릉이를 먼저 보충해야 할 대여소를 찾아야 합니다.',
		image: '/images/themes/bike-rebalance/intro.png',
		imageAlt: '따릉이 대여소 데이터를 분석하는 장면',

		summaryTitle: '현재 상황',
		summary:
			'서울시 공공자전거 따릉이는 대여소마다 이용량이 다릅니다. 이용이 많은 대여소는 자전거가 더 빨리 부족해질 수 있습니다. 하지만 대여소, 지역, 이용자, 시기 데이터가 나뉘어 있어 여러 자료를 함께 살펴봐야 합니다.',

		goalTitle: '우리의 임무',
		missionGoal:
			'미션 1에서는 각자 맡은 JSON에서 이용건수가 가장 많은 항목과 그 수치를 찾습니다. 미션 2에서는 팀원들이 찾은 네 가지 단서를 모아 따릉이를 먼저 보충해야 할 대여소를 결정합니다.',

		steps: [
			'내 역할에 주어진 JSON을 읽습니다.',
			'이용건수를 비교해 가장 큰 값을 찾습니다.',
			'가장 큰 값에 해당하는 항목과 이용건수를 제출합니다.',
			'팀원들이 찾은 네 가지 단서를 모읍니다.',
			'팀 단서를 근거로 따릉이를 먼저 보충해야 할 대여소를 정합니다.'
		],

		tip: '힌트: 배열 안의 이용건수를 비교한 뒤, 가장 큰 수와 같은 객체에 들어 있는 값을 확인하세요.',

		buttonText: '데이터 분석 시작하기'
	},

	completion: {
		icon: '🚲',
		badge: '최종 보충 결정',
		title: '따릉이 보충 작전 성공!',
		description: '모둠원이 JSON 단서를 모아 따릉이를 먼저 보충해야 할 대여소를 찾아냈습니다.',

		resultTitle: '따릉이 보충 우선 대여소',
		result: '마곡나루역 2번 출구',

		reasons: [
			'대여소별 이용건수가 가장 많음',
			'대여건수가 가장 많은 강서구에 있음',
			'이용건수가 가장 많은 정기권 이용자가 주로 이용함',
			'따릉이 이용건수가 가장 많은 9월에 이용이 많음'
		],

		message: '팀의 JSON 단서를 분석해 따릉이를 먼저 보충해야 할 대여소를 결정했습니다!',

		exitButtonText: '완료하기'
	},

	roles: [
		{
			id: 'station',
			name: '민서',
			roleName: '대여소 분석가',
			avatarSrc: '/images/avatars/1.png'
		},
		{
			id: 'district',
			name: '준호',
			roleName: '지역 분석가',
			avatarSrc: '/images/avatars/2.png'
		},
		{
			id: 'user',
			name: '서연',
			roleName: '이용자 분석가',
			avatarSrc: '/images/avatars/3.png'
		},
		{
			id: 'month',
			name: '도윤',
			roleName: '시기 분석가',
			avatarSrc: '/images/avatars/4.png'
		}
	],

	missions: [
		{
			id: 'clue-extract',
			title: '역할별 JSON 단서 찾기',
			type: 'role-analysis',
			question: '내 JSON에서 이용건수가 가장 많은 항목과 그 이용건수를 찾아보세요.',

			initialJson: `{}`,

			roleMissions: {
				station: {
					story: {
						title: '대여소 JSON 해석',
						call: '대여소 분석가님, 이용건수가 가장 많은 대여소를 찾아주세요.',
						summary:
							'대여소별 이용 JSON에서 이용건수를 비교하고, 가장 많이 이용된 대여소를 찾습니다.',
						mission: '이용건수가 가장 많은 대여소와 그 이용건수를 제출하세요.'
					},

					role: {
						title: '대여소 분석가',
						icon: '📍',
						description: '대여소별 이용건수를 비교해 가장 많이 이용된 대여소를 찾는 역할'
					},

					answerFields: [
						{
							key: '대여소단서',
							label: '이용건수가 가장 많은 대여소는 어디인가요?'
						},
						{
							key: '이용건수',
							label: '그 대여소의 이용건수는 얼마인가요?'
						}
					],

					clues: [
						{
							type: 'json',
							title: '대여소별 이용 JSON',
							data: {
								대여소별이용: [
									{
										대여소: '마곡나루역 2번 출구',
										이용건수: 86780
									},
									{
										대여소: '마곡나루역 3번 출구',
										이용건수: 59620
									}
								],
								찾을것: '이용건수가 가장 많은 대여소와 그 이용건수'
							}
						}
					],

					keyChips: []
				},

				district: {
					story: {
						title: '지역 JSON 해석',
						call: '지역 분석가님, 대여건수가 가장 많은 지역을 찾아주세요.',
						summary:
							'자치구별 대여 JSON에서 대여건수를 비교하고, 따릉이 대여가 가장 많은 지역을 찾습니다.',
						mission: '대여건수가 가장 많은 지역과 그 대여건수를 제출하세요.'
					},

					role: {
						title: '지역 분석가',
						icon: '🗺️',
						description: '자치구별 대여건수를 비교해 대여가 가장 많은 지역을 찾는 역할'
					},

					answerFields: [
						{
							key: '지역단서',
							label: '대여건수가 가장 많은 지역은 어디인가요?'
						},
						{
							key: '대여건수',
							label: '그 지역의 대여건수는 얼마인가요?'
						}
					],

					clues: [
						{
							type: 'json',
							title: '자치구별 대여 JSON',
							data: {
								자치구별대여: [
									{
										자치구: '강서구',
										대여건수: 3274017
									},
									{
										자치구: '송파구',
										대여건수: 2684444
									}
								],
								찾을것: '대여건수가 가장 많은 지역과 그 대여건수'
							}
						}
					],

					keyChips: []
				},

				user: {
					story: {
						title: '이용자 JSON 해석',
						call: '이용자 분석가님, 이용건수가 가장 많은 대여권을 찾아주세요.',
						summary:
							'대여권별 이용 JSON에서 이용건수를 비교하고, 가장 많이 이용된 대여권을 찾습니다.',
						mission: '이용건수가 가장 많은 대여권과 그 이용건수를 제출하세요.'
					},

					role: {
						title: '이용자 분석가',
						icon: '👥',
						description: '대여권별 이용건수를 비교해 가장 많이 이용된 대여권을 찾는 역할'
					},

					answerFields: [
						{
							key: '이용자단서',
							label: '이용건수가 가장 많은 대여권은 무엇인가요?'
						},
						{
							key: '이용건수',
							label: '그 대여권의 이용건수는 얼마인가요?'
						}
					],

					clues: [
						{
							type: 'json',
							title: '대여권별 이용 JSON',
							data: {
								대여권별이용: [
									{
										대여권: '정기권',
										이용건수: 16480345
									},
									{
										대여권: '일일권',
										이용건수: 2986729
									}
								],
								찾을것: '이용건수가 가장 많은 대여권과 그 이용건수'
							}
						}
					],

					keyChips: []
				},

				month: {
					story: {
						title: '시기 JSON 해석',
						call: '시기 분석가님, 이용건수가 가장 많은 달을 찾아주세요.',
						summary:
							'월별 이용 JSON에서 이용건수를 비교하고, 따릉이 이용이 가장 많은 달을 찾습니다.',
						mission: '이용건수가 가장 많은 달과 그 이용건수를 제출하세요.'
					},

					role: {
						title: '시기 분석가',
						icon: '📅',
						description: '월별 이용건수를 비교해 따릉이 이용이 가장 많은 달을 찾는 역할'
					},

					answerFields: [
						{
							key: '시기단서',
							label: '따릉이 이용건수가 가장 많은 달은 언제인가요?'
						},
						{
							key: '이용건수',
							label: '그 달의 이용건수는 얼마인가요?'
						}
					],

					clues: [
						{
							type: 'json',
							title: '월별 이용 JSON',
							data: {
								월별이용: [
									{
										월: '2025년 9월',
										이용건수: 3992326
									},
									{
										월: '2025년 12월',
										이용건수: 1965174
									}
								],
								찾을것: '이용건수가 가장 많은 달과 그 이용건수'
							}
						}
					],

					keyChips: []
				}
			}
		},

		{
			id: 'final-rebalance',
			title: '따릉이 보충 대여소 정하기',
			type: 'team-inference',

			question: '팀이 찾은 단서를 바탕으로 따릉이를 먼저 보충해야 할 대여소를 찾아보세요.',

			answerFields: [
				{
					key: '보충할대여소',
					label: '따릉이를 먼저 보충해야 할 대여소는 어디인가요?'
				},
				{
					key: '확인한단서',
					label: '어떤 단서를 확인하고 그렇게 판단했나요?',
					multiline: true
				}
			],

			initialJson: `{
  "보충할대여소": "",
  "확인한단서": ""
}`,

			sourceMissionId: 'clue-extract',
			sourceAnswerTitle: '팀이 찾은 네 가지 단서',

			roleMissions: {
				station: createFinalRebalanceRoleMission(
					'대여소 단서를 설명하고, 다른 팀원의 단서와 함께 따릉이를 먼저 보충해야 할 대여소를 정하세요.'
				),

				district: createFinalRebalanceRoleMission(
					'지역 단서를 설명하고, 다른 팀원의 단서와 함께 따릉이를 먼저 보충해야 할 대여소를 정하세요.'
				),

				user: createFinalRebalanceRoleMission(
					'이용자 단서를 설명하고, 다른 팀원의 단서와 함께 따릉이를 먼저 보충해야 할 대여소를 정하세요.'
				),

				month: createFinalRebalanceRoleMission(
					'시기 단서를 설명하고, 다른 팀원의 단서와 함께 따릉이를 먼저 보충해야 할 대여소를 정하세요.'
				)
			}
		}
	]
};

function createFinalRebalanceRoleMission(call) {
	return {
		story: {
			title: '보충 대여소 결정',
			call,

			summary:
				'각자 찾은 단서를 말하고, 후보 대여소의 정보를 비교해 따릉이를 먼저 보충해야 할 곳을 정합니다.',

			mission: '팀의 단서를 근거로 따릉이를 먼저 보충해야 할 대여소를 고르고 이유를 작성하세요.'
		},

		role: {
			title: '보충 대여소 결정',
			icon: '🧩',
			description: '팀 단서를 모아 따릉이 보충 우선 대여소를 결정하는 역할'
		},

		clues: [
			{
				type: 'json',
				title: '후보 대여소 JSON',

				data: {
					후보대여소: [
						{
							대여소: '마곡나루역 2번 출구',
							지역: '강서구',
							주요대여권: '정기권',
							이용이많은달: '2025년 9월'
						},
						{
							대여소: '롯데월드타워 앞',
							지역: '송파구',
							주요대여권: '일일권',
							이용이많은달: '2025년 5월'
						},
						{
							대여소: '영등포구청역 7번 출구',
							지역: '영등포구',
							주요대여권: '정기권',
							이용이많은달: '2025년 12월'
						}
					],

					확인할정보: ['대여소', '지역', '주요대여권', '이용이많은달'],

					할일: '팀이 찾은 단서를 바탕으로 따릉이를 먼저 보충해야 할 대여소를 고르세요.'
				}
			}
		],

		keyChips: []
	};
}
