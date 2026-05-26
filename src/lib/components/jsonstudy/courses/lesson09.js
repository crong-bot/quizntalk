export const lesson09 = {
	id: 'lesson09',
	title: '초등학생 책 추천 AI 학습시키기',
	conceptLabel: '종합 연습',

	contentBlocks: [
		
		{
			type: 'paragraph',
			parts: [
				{ text: '이제 지금까지 배운 내용을 모아서 ' },
				{ text: '초등학생 책 추천 AI', tone: 'blue' },
				{ text: '를 학습시키는 데이터를 만들어 볼거에요.' },
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '정보 카드에는 ' },
				{ text: '책제목', tone: 'amber' },
				{ text: ', ' },
				{ text: '분야', tone: 'emerald' },
				{ text: ', ' },
				{ text: '대상학년', tone: 'rose' },
				{ text: ', ' },
				{ text: '주제', tone: 'amber' },
				{ text: ', ' },
				{ text: '난이도', tone: 'emerald' },
				{ text: ', ' },
				{ text: '대여가능', tone: 'rose' },
				{ text: ', ' },
				{ text: '의 정보가 들어가요.' }
			]
		},
		{
			type: 'image',
			src: '/images/lessson/lesson09_book1.png',
			alt: '학교도서관 책 추천 AI 학습시키기'
		},
		{
			type: 'image',
			src: '/images/lessson/lesson09_book2.png',
			alt: '학교도서관 책 추천 AI 학습시키기'
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '해당 2권의 정보를 JSON형태로 정리해서 AI학습에 활용할거에요.' },
				
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '지금은 2권 뿐이지만 이런 데이터가 많이 모이면 책을 추천하는 AI를 만들 수 있어요!' },
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '아래 예시 JSON를 확인해서 "도서학습데이터" 키에 값들을 넣어봅시다!' },	
			]
		},
		
		{
			type: 'example',
			title: '예시',
			before: 'AI 학습 데이터 예시',
			after: `{ 
  "책제목": "행복 찾기", 
  "분야": "문학", 
  "대상학년": [5, 6], 
  "주제": ["행복", "친구", "지구"], 
  "난이도": "쉬움", 
  "대여가능": true 
}`
		},
		// {
		// 	type: 'tip',
		// 	title: '마지막 점검',
		// 	items: [
		// 		'글자 값은 큰따옴표 안에 써요.',
		// 		'숫자 값은 큰따옴표 없이 써요.',
		// 		'true와 false도 큰따옴표 없이 써요.',
		// 		'여러 값은 목록 [ ] 안에 넣어요.',
		// 		'정보와 정보 사이는 쉼표(,)로 나누어요.',
		// 		'전체 정보는 { } 안에 담아요.'
		// 	]
		// }
	],

	task: 'AI 학습 도우미에게 줄 학교 생활 정보를 완성하고 실행하기를 눌러보세요.',
	initialCode: `{
"도서학습데이터":
}`,
	answer: {
		
		"도서데이터": [
			{
			"책제목": "달빛 도서관의 고양이",
			"분야": "동화",
			"대상학년": [5, 6],
			"주제": ["우정", "동물", "모험"],
			"난이도": "보통",
			"대여가능": true
			},
			{
			"책제목": "우주로 간 발명왕",
			"분야": "과학",
			"대상학년": [5, 6],
			"주제": ["우주", "발명", "탐험"],
			"난이도": "어려움",
			"대여가능": false
			}
		]

	},
	hints: [
		'도서데이터에 여러 값이 들어갈 때는 어떻게 해야된다고 했죠?',
		
	]
};
