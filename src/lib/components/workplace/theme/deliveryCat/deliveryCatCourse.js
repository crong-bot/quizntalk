// src/lib/components/workplace/theme/deliveryCat/deliveryCatCourse.js

export const deliveryCatCourse = {
	id: 'deliveryCat',
	title: '배달냥 전략팀: 고객 만족 작전',
	subtitle: '흩어진 배달앱 데이터를 분석해 우리 팀의 운영 전략을 세워보세요!',
	icon: '🐱',
	themeId: 'deliveryCat',
	categoryId: 'read',
	categoryTitle: '제이슨 해석',
	mode: 'read',

	intro: {
		badge: 'STRATEGY BRIEFING',
		title: '배달냥 전략팀 긴급 회의',
		subtitle: '고객, 주문, 가게, 운영 규칙 데이터를 모아 더 좋은 배달앱 전략을 세워보세요.',
		image: '/images/themes/delivery-cat/intro.png',
		imageAlt: '배달냥 전략팀이 데이터를 분석하는 장면',
		summaryTitle: '현재 상황',
		summary:
			'귀여운 배달앱 배달냥에 고객 불만이 들어왔습니다. 하지만 문제를 해결하는 데 필요한 데이터가 역할별로 나뉘어 있어, 혼자서는 전체 상황을 알 수 없습니다.',
		goalTitle: '우리의 임무',
		missionGoal:
			'각자 받은 JSON 데이터를 읽고 중요한 단서를 분석하세요. 팀원들의 분석을 모아 고객 만족도를 높일 운영 전략을 세워야 합니다.',
		steps: [
			'내 역할에 주어진 JSON 데이터를 확인합니다.',
			'데이터에서 중요한 정보를 찾아 분석합니다.',
			'분석 결과를 제출하고 팀원의 정보를 기다립니다.',
			'모든 분석이 모이면 배달냥의 운영 전략을 완성합니다.'
		],
		tip: '힌트: 별점, 거리, 배달 시간, 고객 취향 중 무엇을 더 중요하게 볼지 친구들과 이야기해 보세요.',
		buttonText: '전략 회의 시작하기'
	},

	completion: {
		icon: '🐾',
		badge: '최종 전략 보고서',
		title: '배달냥 운영 전략 완성!',
		description:
			'모둠원이 JSON 데이터를 읽고 근거를 모아 고객 만족도를 높일 운영 전략을 세웠습니다.',
		resultTitle: '전략 방향',
		result: '고객 맞춤형 빠른 배달 추천 전략',
		reasons: [
			'고객은 빠른 배달을 중요하게 생각함',
			'최근 주문에서 배달 지연이 반복됨',
			'가까운 가게 중 고객 취향에 맞는 곳이 있음',
			'반복 지연 고객에게 사과 쿠폰을 제공할 수 있음'
		],
		message: '팀의 데이터 분석으로 배달냥의 운영 전략이 완성되었습니다!',
		exitButtonText: '완료하기'
	},

	roles: [
		{
			id: 'customer',
			name: '민서',
			roleName: '고객 분석 매니저',
			avatarSrc: '/images/avatars/1.png'
		},
		{
			id: 'order',
			name: '준호',
			roleName: '주문 기록 분석가',
			avatarSrc: '/images/avatars/2.png'
		},
		{
			id: 'store',
			name: '서연',
			roleName: '가게 데이터 분석가',
			avatarSrc: '/images/avatars/3.png'
		},
		{
			id: 'operation',
			name: '도윤',
			roleName: '운영 전략 매니저',
			avatarSrc: '/images/avatars/4.png'
		}
	],

	missions: [
		{
			id: 'role-analysis',
			title: '역할별 JSON 데이터 분석',
			type: 'role-analysis',
			question: '내 데이터에서 찾은 중요한 단서와 전략팀에 알려야 할 내용을 적어보세요.',
			initialJson: `{
  "내가본자료": "",
  "중요단서": [],
  "전략팀에알릴내용": ""
}`,

			roleMissions: {
				customer: {
					story: {
						title: '역할별 JSON 데이터 분석',
						call: '고객 분석 매니저님, 고객이 무엇을 중요하게 생각하는지 확인해 주세요.',
						summary:
							'고객의 주문 횟수, 선호, 싫어하는 것, 중요하게 생각하는 조건을 분석해야 합니다.',
						mission: '고객 데이터에서 중요한 단서를 찾아 분석 결과 JSON으로 제출하세요.'
					},
					role: {
						title: '고객 분석 매니저',
						icon: '🙋',
						description: '고객의 취향과 불편 사항을 분석하는 역할'
					},
					clues: [
						{
							type: 'json',
							title: '고객 JSON 데이터',
							data: {
								고객: {
									닉네임: '파란고래',
									주문횟수: 18,
									중요하게생각하는것: ['빠른배달', '저렴한가격'],
									좋아하는음식: ['분식', '김밥', '만두'],
									싫어하는것: ['매운맛', '긴대기시간']
								}
							}
						}
					],
					keyChips: []
				},

				order: {
					story: {
						title: '역할별 JSON 데이터 분석',
						call: '주문 기록 분석가님, 최근 주문에서 어떤 문제가 반복되었는지 확인해 주세요.',
						summary: '예상 도착 시간과 실제 도착 시간을 비교해 배달 지연 여부를 분석해야 합니다.',
						mission: '주문 기록에서 반복되는 문제를 찾아 분석 결과 JSON으로 제출하세요.'
					},
					role: {
						title: '주문 기록 분석가',
						icon: '🧾',
						description: '최근 주문과 배달 시간을 분석하는 역할'
					},
					clues: [
						{
							type: 'json',
							title: '최근 주문 JSON 데이터',
							data: {
								최근주문: [
									{
										주문번호: 'O101',
										메뉴: '김밥세트',
										예상도착: '18:20',
										실제도착: '18:42',
										상태: '늦음'
									},
									{
										주문번호: 'O102',
										메뉴: '만두세트',
										예상도착: '19:10',
										실제도착: '19:35',
										상태: '늦음'
									},
									{
										주문번호: 'O103',
										메뉴: '우동',
										예상도착: '17:30',
										실제도착: '17:32',
										상태: '정상'
									}
								]
							}
						}
					],
					keyChips: []
				},

				store: {
					story: {
						title: '역할별 JSON 데이터 분석',
						call: '가게 데이터 분석가님, 어떤 가게를 먼저 추천하면 좋을지 확인해 주세요.',
						summary: '거리, 평균 배달 시간, 메뉴 특징, 매운맛 여부를 비교해야 합니다.',
						mission:
							'고객에게 추천하기 좋은 가게와 조심해야 할 가게를 분석 결과 JSON으로 제출하세요.'
					},
					role: {
						title: '가게 데이터 분석가',
						icon: '🍱',
						description: '가게의 거리, 배달 시간, 메뉴 특징을 분석하는 역할'
					},
					clues: [
						{
							type: 'json',
							title: '가게 JSON 데이터',
							data: {
								가게목록: [
									{
										가게: '튼튼분식',
										거리: 300,
										평균배달시간: 18,
										대표메뉴: '김밥',
										가격대: '저렴',
										매운맛: false,
										영업중: true
									},
									{
										가게: '불꽃떡볶이',
										거리: 1200,
										평균배달시간: 35,
										대표메뉴: '매운떡볶이',
										가격대: '저렴',
										매운맛: true,
										영업중: true
									},
									{
										가게: '별빛파스타',
										거리: 900,
										평균배달시간: 28,
										대표메뉴: '크림파스타',
										가격대: '보통',
										매운맛: false,
										영업중: true
									}
								]
							}
						}
					],
					keyChips: []
				},

				operation: {
					story: {
						title: '역할별 JSON 데이터 분석',
						call: '운영 전략 매니저님, 배달냥의 운영 규칙을 확인해 주세요.',
						summary:
							'반복 지연 고객, 빠른 배달 선호 고객, 싫어하는 맛에 대한 운영 규칙을 분석해야 합니다.',
						mission: '운영 규칙에서 전략팀이 꼭 지켜야 할 기준을 분석 결과 JSON으로 제출하세요.'
					},
					role: {
						title: '운영 전략 매니저',
						icon: '📊',
						description: '배달앱의 추천 기준과 대응 규칙을 분석하는 역할'
					},
					clues: [
						{
							type: 'json',
							title: '운영 규칙 JSON 데이터',
							data: {
								운영규칙: {
									반복지연고객: '사과쿠폰제공',
									빠른배달선호고객: '가까운가게우선추천',
									싫어하는맛: '추천에서제외',
									첫화면추천기준: ['영업중', '고객취향', '배달시간', '거리', '가격'],
									주의: '별점이 높아도 고객이 싫어하는 조건과 맞지 않으면 첫 번째로 추천하지 않습니다.'
								}
							}
						}
					],
					keyChips: []
				}
			}
		},

		{
			id: 'strategy-report',
			title: '최종 운영 전략 보고서',
			type: 'role-analysis',
			question: '배달냥의 운영 전략 보고서를 작성해보세요.',

			supportGuideForThreePlayers: {
				title: '본부 지원 단서',
				description:
					'3명 방에서는 운영 전략 매니저의 자료를 본부가 대신 제공합니다. 아래 단서도 함께 사용해 최종 운영 전략을 작성하세요.',
				items: [
					'반복 지연 고객에게는 사과 쿠폰을 제공할 수 있습니다.',
					'빠른 배달을 좋아하는 고객에게는 가까운 가게를 먼저 추천합니다.',
					'고객이 싫어하는 맛은 추천에서 제외해야 합니다.',
					'첫 화면 추천은 영업 중, 고객 취향, 배달 시간, 거리, 가격을 함께 고려합니다.'
				]
			},

			initialJson: `{
  "전략이름": "",
  "고객분석": "",
  "문제상황": "",
  "운영전략": [],
  "추천가게": "",
  "제외할가게": "",
  "판단근거": [],
  "기대효과": ""
}`,

			roleMissions: {
				customer: createStrategyReportRoleMission(
					'고객 분석 결과를 팀에 공유하고, 최종 운영 전략 보고서를 작성하세요.'
				),
				order: createStrategyReportRoleMission(
					'주문 기록 분석 결과를 팀에 공유하고, 최종 운영 전략 보고서를 작성하세요.'
				),
				store: createStrategyReportRoleMission(
					'가게 데이터 분석 결과를 팀에 공유하고, 최종 운영 전략 보고서를 작성하세요.'
				),
				operation: createStrategyReportRoleMission(
					'운영 규칙 분석 결과를 팀에 공유하고, 최종 운영 전략 보고서를 작성하세요.'
				)
			}
		}
	]
};

function createStrategyReportRoleMission(call) {
	return {
		story: {
			title: '최종 운영 전략 보고서',
			call,
			summary: '모둠원의 분석 결과를 종합해 배달냥 고객을 위한 운영 전략을 정리합니다.',
			mission:
				'전략이름, 고객분석, 문제상황, 운영전략, 추천가게, 제외할가게, 판단근거, 기대효과를 JSON으로 작성하세요.'
		},
		role: {
			title: '팀 운영 전략 작성',
			icon: '📋',
			description: '모둠의 최종 운영 전략 보고서를 정리하는 역할'
		},
		clues: [
			{
				type: 'json',
				title: '보고서 작성방법',
				data: {
					전략이름: '우리 팀의 운영 전략 이름',
					고객분석: '고객이 무엇을 중요하게 생각하는지 정리하기',
					문제상황: '데이터에서 찾은 가장 중요한 문제',
					운영전략: [
						'고객에게 어떤 도움을 줄지',
						'어떤 가게를 먼저 추천할지',
						'어떤 조건을 추천에서 제외할지'
					],
					추천가게: '팀이 먼저 추천하기로 한 가게',
					제외할가게: '추천에서 제외하거나 뒤로 미룰 가게',
					판단근거: [
						'고객 데이터에서 찾은 근거',
						'주문 기록에서 찾은 근거',
						'가게 데이터에서 찾은 근거',
						'운영 규칙에서 찾은 근거'
					],
					기대효과: '이 전략을 사용하면 좋아질 점'
				}
			}
		],
		keyChips: []
	};
}
