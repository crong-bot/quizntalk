// src/lib/components/workplace/theme/bikeRebalance/bikeRebalanceCourse.js

export const bikeRebalanceCourse = {
	id: 'bikeRebalance',
	title: '따릉이 데이터 분석대: 보충 대여소를 찾아라',
	subtitle: '각자 JSON 단서를 해석하고, 팀 단서를 모아 자전거가 더 필요한 대여소를 찾아보세요!',
	icon: '🚲',
	themeId: 'bikeRebalance',
	isRealData: true,
	categoryId: 'read',
	categoryTitle: '제이슨 해석',
	mode: 'read',

	intro: {
		badge: 'DATA BRIEFING',
		title: '따릉이 보충 작전 시작',
		subtitle: '흩어진 JSON 단서를 모아 자전거가 더 필요한 대여소를 찾아야 합니다.',
		image: '/images/themes/bike-rebalance/intro.png',
		imageAlt: '따릉이 대여소 데이터를 분석하는 장면',
		summaryTitle: '현재 상황',
		summary:
			'서울시 공공자전거 따릉이는 대여소마다 이용량이 다릅니다. 어떤 대여소는 이용이 많아 자전거가 빨리 부족해질 수 있습니다. 하지만 대여소, 지역, 이용자, 시기 데이터가 나뉘어 있어 혼자서는 판단하기 어렵습니다.',
		goalTitle: '우리의 임무',
		missionGoal:
			'미션 1에서는 각자 맡은 JSON에서 팀원에게 알려 줄 중요한 단서를 찾습니다. 미션 2에서는 팀원들의 단서를 모아 후보 대여소와 비교하고, 자전거를 먼저 보충할 대여소를 정합니다.',
		steps: [
			'내 역할에 주어진 JSON 단서를 읽습니다.',
			'두 자료를 비교하고 여러 키를 함께 확인합니다.',
			'팀원에게 알려 줄 중요한 단서를 제출합니다.',
			'팀 단서와 후보 대여소를 비교해 보충 우선 대여소를 정합니다.'
		],
		tip: '힌트: 미션 1에서는 최종 정답을 맞히는 것이 아니라, 팀원에게 알려 줄 단서를 찾는 것이 중요합니다.',
		buttonText: '데이터 분석 시작하기'
	},

	completion: {
		icon: '🚲',
		badge: '최종 보충 결정',
		title: '따릉이 보충 작전 성공!',
		description: '모둠원이 JSON 단서를 모아 자전거를 먼저 보충할 대여소를 찾아냈습니다.',
		resultTitle: '보충 우선 대여소',
		result: '마곡나루역 2번 출구',
		reasons: [
			'이용건수가 가장 많은 대여소임',
			'강서구는 대여건수가 많은 지역임',
			'정기권 이용자가 많아 반복 이용 수요가 큼',
			'9월처럼 이용이 많은 시기 전에 미리 보충할 필요가 있음'
		],
		message: '팀의 JSON 단서 분석으로 따릉이 보충 우선 대여소를 찾았습니다!',
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
			question: '내 JSON을 읽고 팀원에게 알려 줄 중요한 단서를 찾아보세요.',
			initialJson: `{}`,

			roleMissions: {
				station: {
					story: {
						title: '대여소 JSON 해석',
						call: '대여소 분석가님, 대여소별 이용건수를 확인해 주세요.',
						summary:
							'두 대여소의 순위, 대여소명, 이용건수를 함께 비교해 팀원에게 알려 줄 대여소 단서를 찾습니다.',
						mission: '어떤 대여소를 팀원에게 알려야 할지 고르고, 그 이유를 제출하세요.'
					},
					role: {
						title: '대여소 분석가',
						icon: '📍',
						description: '대여소별 이용건수를 비교해 팀에 알릴 단서를 찾는 역할'
					},
					answerFields: [
						{
							key: '대여소단서',
							label: '어떤 대여소를 팀원에게 알려야 할까요?'
						},
						{
							key: '이유',
							label: '그 대여소를 고른 이유는 무엇인가요?'
						}
					],
					clues: [
						{
							type: 'json',
							title: '대여소별 이용 JSON',
							data: {
								대여소별이용: [
									{
										순위: 1,
										대여소: '마곡나루역 2번 출구',
										이용건수: 86780
									},
									{
										순위: 2,
										대여소: '마곡나루역 3번 출구',
										이용건수: 59620
									}
								],
								찾을것: '순위와 이용건수를 함께 보고 팀원에게 알려 줄 대여소 고르기'
							}
						}
					],
					keyChips: []
				},

				district: {
					story: {
						title: '지역 JSON 해석',
						call: '지역 분석가님, 자치구별 대여건수를 확인해 주세요.',
						summary:
							'두 자치구의 순위, 자치구명, 대여건수를 함께 비교해 팀원에게 알려 줄 지역 단서를 찾습니다.',
						mission: '어떤 지역을 팀원에게 알려야 할지 고르고, 그 이유를 제출하세요.'
					},
					role: {
						title: '지역 분석가',
						icon: '🗺️',
						description: '자치구별 대여건수를 비교해 팀에 알릴 단서를 찾는 역할'
					},
					answerFields: [
						{
							key: '지역단서',
							label: '어떤 지역을 팀원에게 알려야 할까요?'
						},
						{
							key: '이유',
							label: '그 지역을 고른 이유는 무엇인가요?'
						}
					],
					clues: [
						{
							type: 'json',
							title: '자치구별 대여 JSON',
							data: {
								자치구별대여: [
									{
										순위: 1,
										자치구: '강서구',
										대여건수: 3274017
									},
									{
										순위: 2,
										자치구: '송파구',
										대여건수: 2684444
									}
								],
								찾을것: '순위와 대여건수를 함께 보고 팀원에게 알려 줄 지역 고르기'
							}
						}
					],
					keyChips: []
				},

				user: {
					story: {
						title: '이용자 JSON 해석',
						call: '이용자 분석가님, 이용자 유형 데이터를 확인해 주세요.',
						summary:
							'연령대별 이용과 대여권별 이용을 함께 보고 따릉이를 자주 이용하는 사람들의 단서를 찾습니다.',
						mission: '어떤 이용자 특징을 팀원에게 알려야 할지 고르고, 그 이유를 제출하세요.'
					},
					role: {
						title: '이용자 분석가',
						icon: '👥',
						description: '연령대와 대여권 종류를 보고 이용자 단서를 찾는 역할'
					},
					answerFields: [
						{
							key: '이용자단서',
							label: '어떤 이용자 특징을 팀원에게 알려야 할까요?'
						},
						{
							key: '이유',
							label: '그 특징을 고른 이유는 무엇인가요?'
						}
					],
					clues: [
						{
							type: 'json',
							title: '이용자 유형 JSON',
							data: {
								연령대별이용: [
									{
										순위: 1,
										연령대: '30대',
										이용건수: 5302908
									},
									{
										순위: 2,
										연령대: '20대',
										이용건수: 5097841
									}
								],
								대여권별이용: [
									{
										순위: 1,
										대여권: '정기권',
										이용건수: 16480345
									},
									{
										순위: 2,
										대여권: '일일권',
										이용건수: 2986729
									}
								],
								찾을것: '연령대별 이용과 대여권별 이용을 함께 보고 자주 이용하는 사람들의 특징 찾기'
							}
						}
					],
					keyChips: []
				},

				month: {
					story: {
						title: '시기 JSON 해석',
						call: '시기 분석가님, 월별 이용건수 변화를 확인해 주세요.',
						summary:
							'두 달의 월, 이용건수, 변화 특징을 함께 비교해 팀원에게 알려 줄 시기 단서를 찾습니다.',
						mission: '어떤 시기를 팀원에게 알려야 할지 고르고, 그 이유를 제출하세요.'
					},
					role: {
						title: '시기 분석가',
						icon: '📅',
						description: '월별 이용건수를 비교해 보충 시기 단서를 찾는 역할'
					},
					answerFields: [
						{
							key: '시기단서',
							label: '어떤 시기를 팀원에게 알려야 할까요?'
						},
						{
							key: '이유',
							label: '그 시기를 고른 이유는 무엇인가요?'
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
										이용건수: 3992326,
										특징: '가장 많음'
									},
									{
										월: '2025년 12월',
										이용건수: 1965174,
										특징: '크게 줄어듦'
									}
								],
								찾을것: '월, 이용건수, 특징을 함께 보고 보충에 중요한 시기 찾기'
							}
						}
					],
					keyChips: []
				}
			}
		},

		{
			id: 'final-rebalance',
			title: '팀 단서로 보충 대여소 정하기',
			type: 'team-inference',
			question: '팀원들이 찾은 단서와 후보 대여소를 비교해 자전거를 먼저 보충할 곳을 정하세요.',
			answerFields: [
				{
					key: '보충할대여소',
					label: '자전거를 먼저 보충할 대여소는 어디인가요?'
				},
				{
					key: '그렇게생각한이유',
					label: '그렇게 생각한 이유는 무엇인가요?',
					multiline: true
				}
			],
			initialJson: `{
  "보충할대여소": "",
  "그렇게생각한이유": ""
}`,

			sourceMissionId: 'clue-extract',
			sourceAnswerTitle: '팀이 찾은 단서',

			roleMissions: {
				station: createFinalRebalanceRoleMission(
					'팀원들의 단서를 모아 자전거를 먼저 보충할 대여소를 정하세요.'
				),
				district: createFinalRebalanceRoleMission(
					'팀원들의 단서를 모아 자전거를 먼저 보충할 대여소를 정하세요.'
				),
				user: createFinalRebalanceRoleMission(
					'팀원들의 단서를 모아 자전거를 먼저 보충할 대여소를 정하세요.'
				),
				month: createFinalRebalanceRoleMission(
					'팀원들의 단서를 모아 자전거를 먼저 보충할 대여소를 정하세요.'
				)
			}
		}
	]
};

function createFinalRebalanceRoleMission(call) {
	return {
		story: {
			title: '팀 단서 토론',
			call,
			summary: '각자 찾은 단서를 말하고, 후보 대여소 중 자전거를 먼저 보충할 곳을 함께 고릅니다.',
			mission: '팀 단서와 가장 많이 맞는 대여소를 고르고 이유를 작성하세요.'
		},
		role: {
			title: '팀 단서 토론',
			icon: '🧩',
			description: '팀 단서를 모아 보충 우선 대여소를 정하는 역할'
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
							특징: ['이용건수 가장 많음', '강서구', '출퇴근 이용 많음']
						},
						{
							대여소: '롯데월드타워 앞',
							지역: '송파구',
							특징: ['이용건수 많음', '관광객 이용 많음', '일일권 이용 많음']
						},
						{
							대여소: '영등포구청역 7번 출구',
							지역: '영등포구',
							특징: ['이용건수 보통', '사무실 주변', '평일 이용 많음']
						}
					],
					할일: '팀 단서와 가장 많이 맞는 대여소를 고르세요.'
				}
			}
		],
		keyChips: []
	};
}
