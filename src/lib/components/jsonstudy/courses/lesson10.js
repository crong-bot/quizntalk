export const lesson10 = {
	id: 'lesson10',
	title: 'AI에게 줄 정보 카드 완성하기',
	conceptLabel: '종합 연습',

	contentBlocks: [
		{
			type: 'image',
			src: '/images/lessson/lesson10_ai_card.png',
			alt: 'AI에게 줄 정보 카드를 완성하는 그림'
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '이제 지금까지 배운 내용을 모아서 ' },
				{ text: 'AI에게 줄 정보 카드', tone: 'blue' },
				{ text: '를 완성해볼 거예요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '정보 카드에는 ' },
				{ text: '글자 값', tone: 'amber' },
				{ text: ', ' },
				{ text: '숫자 값', tone: 'emerald' },
				{ text: ', ' },
				{ text: 'true/false', tone: 'rose' },
				{ text: ', ' },
				{ text: '목록', tone: 'blue' },
				{ text: '이 함께 들어갈 수 있어요.' }
			]
		},
		{
			type: 'example',
			title: '여러 종류의 값이 함께 들어가는 모습',
			before: 'AI 학습 도우미에게 앱 이름, 사용자, 알림 수, 로그인 상태, 관심 메뉴를 알려줘.',
			after: `{
  "앱이름": "오늘의학교",
  "사용자": "민준",
  "알림수": 3,
  "로그인됨": true,
  "관심메뉴": ["날씨", "급식", "버스", "알림"]
}`
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '"앱이름"', tone: 'rose' },
				{ text: '과 ' },
				{ text: '"사용자"', tone: 'rose' },
				{ text: '에는 글자가 들어가니까 값에 ' },
				{ text: '큰따옴표', tone: 'amber' },
				{ text: '를 써요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '"알림수"', tone: 'rose' },
				{ text: '에는 숫자가 들어가니까 ' },
				{ text: '3', tone: 'emerald' },
				{ text: '처럼 큰따옴표 없이 써요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '"로그인됨"', tone: 'rose' },
				{ text: '에는 상태가 들어가니까 ' },
				{ text: 'true', tone: 'emerald' },
				{ text: '처럼 큰따옴표 없이 써요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '"관심메뉴"', tone: 'rose' },
				{ text: '에는 여러 값이 들어가니까 ' },
				{ text: '[ ]', tone: 'blue' },
				{ text: ' 목록을 사용해요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [{ text: '잘 정리된 정보는 컴퓨터와 AI가 더 쉽게 이해할 수 있어요.' }]
		},
		{
			type: 'tip',
			title: '마지막 점검',
			items: [
				'글자 값은 큰따옴표 안에 써요.',
				'숫자 값은 큰따옴표 없이 써요.',
				'true와 false도 큰따옴표 없이 써요.',
				'여러 값은 목록 [ ] 안에 넣어요.',
				'정보와 정보 사이는 쉼표(,)로 나누어요.',
				'전체 정보는 { } 안에 담아요.'
			]
		}
	],

	task: 'AI 학습 도우미에게 줄 학교 생활 정보를 완성하고 실행하기를 눌러보세요.',
	initialCode: `{
  "앱이름": "",
  "사용자": "",
  "알림수": 0,
  "로그인됨": false,
  "관심메뉴": []
}`,
	answer: {
		앱이름: '오늘의학교',
		사용자: '민준',
		알림수: 3,
		로그인됨: true,
		관심메뉴: ['날씨', '급식', '버스', '알림']
	},
	hints: [
		'"앱이름"은 "오늘의학교"예요.',
		'"사용자"는 "민준"이에요.',
		'"알림수"는 숫자 값 3이에요.',
		'"로그인됨"은 true예요.',
		'"관심메뉴"는 ["날씨", "급식", "버스", "알림"]처럼 목록으로 써요.'
	]
};
