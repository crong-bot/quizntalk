// src/lib/components/workplace/theme/marketBasket/marketBasketCourse.js

export const marketBasketCourse = {
	id: 'marketBasket',
	title: '장바구니 탐정단: 우리 마트의 비상 대비 용품 코너 만들기',
	subtitle: '여러 장바구니 데이터를 분석하고, 마트의 상품 진열을 해보세요!',
	icon: '🛒',
	themeId: 'marketBasket',
	categoryId: 'read',
	categoryTitle: '제이슨 해석',
	mode: 'read',

	intro: {
		badge: 'DATA BRIEFING',
		title: '장바구니 탐정단 출동',
		subtitle: '장바구니 속에 숨어 있는 힌트를 찾아보세요..',
		image: '/images/themes/market-basket/intro.png',
		imageAlt: '마트 데이터 탐정단이 장바구니 데이터를 분석하는 장면',
		summaryTitle: '현재 상황',
		summary:
			'마트에서는 계절이나 날씨에 따라 고객들이 평소와 다른 물건을 함께 사기도 합니다. 장바구니 데이터를 살펴보면 어떤 상품을 가까이 진열하면 좋을지 알 수 있습니다.',
		goalTitle: '우리의 임무',
		missionGoal:
			'미션 1에서는 각자 맡은 장바구니 JSON을 분석해 고객들이 함께 구입한 비상 대비 상품 조합을 찾습니다. 미션 2에서는 팀원들의 단서를 모아 비상 대비 코너에 진열할 상품 조합을 정합니다.',
		steps: [
			'각자 맡은 장바구니 JSON 3개를 읽습니다.',
			'장바구니마다 반복해서 함께 나온 상품을 찾습니다.',
			'미션1에서는 고객들이 함께 구입한 상품 조합을 제출합니다.',
			'미션2에서는 팀원들의 단서를 모아 계절별 비상 대비 상품 조합을 정합니다.'
		],
		tip: '힌트: 모든 장바구니에 똑같이 들어 있는 상품만 찾는 것이 아닙니다. 3개 중 2개 정도에서 함께 반복되는 상품 조합도 중요한 단서가 될 수 있어요.',
		buttonText: '장바구니 분석 시작하기'
	},

	completion: {
		icon: '📊',
		badge: '최종 비상 대비 코너',
		title: '장바구니 분석 완료!',
		description:
			'모둠원이 장바구니 JSON 데이터를 분석하고, 비상물품 코너에 함께 진열할 상품 조합을 정했습니다.',
		resultTitle: '비상물품 진열 아이디어',
		result:
			'계절이나 상황에 따라 함께 필요한 상품은 가까이 진열하면 고객이 더 쉽게 준비할 수 있습니다.',
		reasons: [
			'장바구니 데이터에서 반복되는 상품 조합을 찾음',
			'상품 조합을 보고 계절이나 상황을 추론함',
			'팀원들의 단서를 모아 계절별 조합을 완성함',
			'비상 상황에서 왜 함께 필요한지 이유를 설명함'
		],
		message: '팀의 JSON 분석으로 좋은 계절별 비상 대비 코너를 만들었습니다!',
		exitButtonText: '완료하기'
	},

	roles: [
		{
			id: 'receipt',
			name: '민서',
			roleName: '데이터분석가',
			avatarSrc: '/images/avatars/1.png'
		},
		{
			id: 'product',
			name: '준호',
			roleName: '데이터분석가',
			avatarSrc: '/images/avatars/2.png'
		},
		{
			id: 'situation',
			name: '서연',
			roleName: '데이터분석가',
			avatarSrc: '/images/avatars/3.png'
		},
		{
			id: 'display',
			name: '도윤',
			roleName: '데이터분석가',
			avatarSrc: '/images/avatars/4.png'
		}
	],

	missions: [
		{
			id: 'basket-analysis',
			title: '장바구니 JSON 분석하기',
			type: 'role-analysis',
			question: '장바구니 데이터를 분석해서, 고객들이 주로 같이 구입한 상품 2가지를 찾아보세요!',
			initialJson: `{}`,

			roleMissions: {
				receipt: createBasketAnalysisMission({
					title: '장바구니 분석',
					call: '분석가님, 장바구니 데이터를 분석해서 고객들이 함께 구입한 상품 조합을 찾아 주세요.',
					basketData: [
						{
							번호: 1,
							구매시간: '오전 10시 15분',
							결제금액: 13600,
							상품: ['마스크', '손소독제', '물티슈']
						},
						{
							번호: 2,
							구매시간: '오후 2시 40분',
							결제금액: 9800,
							상품: ['마스크', '생수', '휴지']
						},
						{
							번호: 3,
							구매시간: '오후 6시 05분',
							결제금액: 15200,
							상품: ['마스크', '손소독제', '비상약']
						}
					]
				}),

				product: createBasketAnalysisMission({
					title: '장바구니 분석',
					call: '분석가님, 장바구니 데이터를 분석해서 고객들이 함께 구입한 상품 조합을 찾아 주세요.',
					basketData: [
						{
							번호: 4,
							구매시간: '오전 11시 30분',
							결제금액: 17200,
							상품: ['선크림', '생수', '부채']
						},
						{
							번호: 5,
							구매시간: '오후 1시 10분',
							결제금액: 21500,
							상품: ['선크림', '모자', '물티슈']
						},
						{
							번호: 6,
							구매시간: '오후 4시 25분',
							결제금액: 18900,
							상품: ['선크림', '생수', '쿨토시']
						}
					]
				}),

				situation: createBasketAnalysisMission({
					title: '장바구니 분석',
					call: '분석가님, 장바구니 데이터를 분석해서 고객들이 함께 구입한 상품 조합을 찾아 주세요.',
					basketData: [
						{
							번호: 7,
							구매시간: '오후 7시 10분',
							결제금액: 22400,
							상품: ['손전등', '건전지', '라디오']
						},
						{
							번호: 8,
							구매시간: '오후 8시 35분',
							결제금액: 16700,
							상품: ['손전등', '물티슈', '비상약']
						},
						{
							번호: 9,
							구매시간: '오후 6시 50분',
							결제금액: 19800,
							상품: ['손전등', '건전지', '생수']
						}
					]
				}),

				display: createBasketAnalysisMission({
					title: '장바구니 분석',
					call: '분석가님, 장바구니 데이터를 분석해서 고객들이 함께 구입한 상품 조합을 찾아 주세요.',
					basketData: [
						{
							번호: 10,
							구매시간: '오전 9시 20분',
							결제금액: 14600,
							상품: ['제설제', '장갑', '생수']
						},
						{
							번호: 11,
							구매시간: '오후 3시 45분',
							결제금액: 12100,
							상품: ['제설제', '미끄럼방지패드', '휴지']
						},
						{
							번호: 12,
							구매시간: '오후 5시 30분',
							결제금액: 15800,
							상품: ['제설제', '장갑', '비상약']
						}
					]
				})
			}
		},

		{
			id: 'emergency-display',
			title: '비상 대비 코너 만들기',
			type: 'role-analysis',
			question:
				'팀원들이 찾은 장바구니 단서를 모아, 우리 마트의 비상 대비 코너에 진열할 상품 2가지를 정해보세요.',
			answerFields: [
				{
					key: '상품조합',
					label: '같이 진열할 비상대피용품 2가지를 써보세요.',
					multiline: false
				},
				{
					key: '이유',
					label: '왜 이렇게 함께 진열하면 좋을까요?',
					multiline: true
				}
			],
			initialJson: ``,

			sourceMissionId: 'basket-analysis',
			sourceAnswerTitle: '팀이 찾은 장바구니 단서',

			roleMissions: {
				receipt: createEmergencyDisplayMission(
					'팀원들과 장바구니 단서를 이야기하고, 같이 진열할 상품을 정하세요.'
				),
				product: createEmergencyDisplayMission(
					'팀원들과 장바구니 단서를 이야기하고, 같이 진열할 상품을 정하세요.'
				),
				situation: createEmergencyDisplayMission(
					'팀원들과 장바구니 단서를 이야기하고, 같이 진열할 상품을 정하세요.'
				),
				display: createEmergencyDisplayMission(
					'팀원들과 장바구니 단서를 이야기하고, 같이 진열할 상품을 정하세요.'
				)
			}
		}
	]
};

function createBasketAnalysisMission({ title, call, basketData }) {
	return {
		story: {
			title,
			call,
			summary: '장바구니 데이터를 읽고, 고객들이 반복해서 함께 구입한 상품 조합을 찾습니다.',
			mission: '함께구입한상품과 관련상황을 JSON으로 작성하세요.'
		},
		role: {
			title,
			icon: '🧺',
			description: '장바구니 데이터를 읽고 함께 구입한 비상 대비 상품을 찾는 역할'
		},
		answerFields: [
			{
				key: '함께구입한상품',
				label: '고객들이 자주 함께 구입한 상품 2가지를 적어보세요.'
			}
		],
		clues: [
			{
				type: 'json',
				title: '내가 맡은 장바구니 JSON',
				data: {
					장바구니기록: basketData
					// 찾을것: [
					// 	'장바구니마다 들어 있는 상품 비교하기',
					// 	'3개 중 2개 이상에서 함께 나온 상품 조합 찾기',
					// 	'상품 조합을 보고 어떤 계절이나 상황과 관련 있는지 생각하기',
					// 	'구매시간과 결제금액은 참고 정보로 살펴보기'
					// ]
				}
			}
		],
		keyChips: []
	};
}

function createEmergencyDisplayMission(call) {
	return {
		story: {
			title: '비상대비용품 코너 만들기',
			call,
			summary:
				'팀원들이 찾은 장바구니 단서를 서로 이야기하고, 우리 마트에 진열할 비상대비용품 조합을 정합니다.',
			mission: '상품조합과 이유를 JSON으로 작성하세요.'
		},
		role: {
			title: '비상 대비 코너 기획',
			icon: '💡',
			description: '팀 단서를 모아 마트에 진열할 비상대비용품 조합을 정하는 역할'
		},
		clues: [
			{
				type: 'json',
				title: '계절별 비상 대비 코너 작성 안내',
				data: {
					생각할점: [
						'혼자보다 같이 진열하면 좋을 물건이 무엇일까요?',
						'친구들이 확인한 물건 중에 어떤 조합을 가장 진열하고 싶나고',
						'같이 놓으면 좋은 점이 있나요?'
					],
					예시: {
						상품조합: '지우개, 연필',
						이유: '연필자국을 지울 지우개가 필요해서 두 개가 모두 필요해서 같이 진열하면 좋을 것 같다.'
					}
				}
			}
		],
		keyChips: []
	};
}
