export const lesson03 = {
	id: 'lesson03',
	title: '글자 값: 큰따옴표 안에 넣기',
	conceptLabel: '글자 값',
	successFeedback: {
				title: '성공! 잘했어요!',
				message: '문자 값은 쌍따옴표 안에! 잊지 마세요!',
				
			},
	contentBlocks: [
		{
			type: 'image',
			src: '/images/lessson/lesson03_string.png',
			alt: '글자 값은 큰따옴표 안에 쓰는 그림'
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '제이슨에서 ' },
				{ text: '글자로 된 값', tone: 'amber' },
				{ text: '은 큰따옴표 안에 써요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '예를 들면 ' },
				{ text: '"독서"', tone: 'amber' },
				{ text: ', ' },
				{ text: '"과학"', tone: 'amber' },
				{ text: ', ' },
				{ text: '"떡볶이"', tone: 'amber' },
				{ text: '처럼 글자는 큰따옴표로 감싸요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '큰따옴표가 없으면 컴퓨터는 이 값이 ' },
				{ text: '글자', tone: 'rose' },
				{ text: '인지 알아보기 어려워요.' }
			]
		},
		{
			type: 'example',
			title: '글자 값이 들어가는 모습',
			before: '민수의 취미는 독서야.',
			after: `{
  "취미": "독서"
}`
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '여기에서 ' },
				{ text: '"취미"', tone: 'rose' },
				{ text: '는 키이고, ' },
				{ text: '"독서"', tone: 'amber' },
				{ text: '는 글자 값이에요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [{ text: '키도 큰따옴표 안에 쓰고, 글자 값도 큰따옴표 안에 써요.' }]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '하지만 숫자 값은 큰따옴표를 쓰지 않아요. 이건 다음 단계에서 더 자세히 배워요.' }
			]
		},
		{
			type: 'tip',
			title: '기억할 점',
			items: [
				'글자 값은 큰따옴표 안에 써요.',
				'취미, 과목, 장소, 메뉴처럼 글자로 된 정보는 글자 값이에요.',
				'큰따옴표가 빠지면 오류가 날 수 있어요.',
				'키도 큰따옴표 안에 써요.',
				'숫자 값에는 큰따옴표를 쓰지 않아요.'
			]
		}
	],

	task: '"좋아하는과목" 키의 값을 "과학"으로 완성하고 실행하기를 눌러보세요.',
	initialCode: `{
  "좋아하는과목": ""
}`,
	answer: {
		좋아하는과목: '과학'
	},
	hints: [
		'"좋아하는과목"은 키예요.',
		'"과학"은 글자 값이에요.',
		'글자 값은 "과학"처럼 큰따옴표 안에 써요.'
	]
};
