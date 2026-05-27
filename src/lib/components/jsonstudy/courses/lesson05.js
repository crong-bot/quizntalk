export const lesson05 = {
	id: 'lesson05',
	title: '숫자 값: 큰따옴표 없이 쓰기',
	conceptLabel: '숫자 값',

	contentBlocks: [
		{
			type: 'image',
			src: '/images/lessson/lesson05_number.png',
			alt: '숫자 값은 큰따옴표 없이 쓰는 그림'
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '제이슨에서 ' },
				{ text: '숫자로 된 값', tone: 'emerald' },
				{ text: '은 큰따옴표 없이 써요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '예를 들면 ' },
				{ text: '가격', tone: 'rose' },
				{ text: ', ' },
				{ text: '개수', tone: 'rose' },
				{ text: ', ' },
				{ text: '기온', tone: 'rose' },
				{ text: ', ' },
				{ text: '점수', tone: 'rose' },
				{ text: '처럼 숫자로 나타낼 수 있는 정보가 있어요.' }
			]
		},
		{
			type: 'example',
			title: '숫자 값이 들어가는 모습',
			before: '오늘 기온은 24도야.',
			after: `{
  "기온": 24
}`
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '여기에서 ' },
				{ text: '"기온"', tone: 'rose' },
				{ text: '은 키이고, ' },
				{ text: '24', tone: 'emerald' },
				{ text: '는 숫자 값이에요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [{ text: '숫자 값은 계산하거나 비교할 수 있어서, 큰따옴표를 붙이지 않아요.' }]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '예를 들어 ' },
				{ text: '24', tone: 'emerald' },
				{ text: '는 숫자 값이지만, ' },
				{ text: '"24"', tone: 'amber' },
				{ text: '는 글자 값이에요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '컴퓨터와 AI가 숫자를 비교하거나 계산하려면 ' },
				{ text: '숫자는 숫자답게', tone: 'emerald' },
				{ text: ' 써야 해요.' }
			]
		},
		{
			type: 'tip',
			title: '기억할 점',
			items: [
				'숫자 값은 큰따옴표 없이 써요.',
				'가격, 개수, 기온, 점수는 숫자 값으로 쓸 수 있어요.',
				'24는 숫자 값이에요.',
				'"24"는 글자 값이에요.',
				'숫자 값은 비교하거나 계산할 수 있어요.'
			]
		}
	],

	task: '"가격"을 29000, "재고"를 12로 완성하고 실행하기를 눌러보세요.',
	initialCode: `{
  "상품명": "무선이어폰",
  "가격": 0,
  "재고": 0
}`,
	answer: {
		상품명: '무선이어폰',
		가격: 29000,
		재고: 12
	},
	hints: [
		'"가격"은 키예요.',
		'29000은 숫자 값이라 큰따옴표 없이 써요.',
		'"재고"도 키예요.',
		'12도 숫자 값이라 큰따옴표 없이 써요.'
	]
};
