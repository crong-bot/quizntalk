export const lesson06 = {
	id: 'lesson06',
	title: '쉼표: 여러 정보를 나누기',
	conceptLabel: '쉼표',

	contentBlocks: [
		{
			type: 'image',
			src: '/images/lessson/lesson06_comma.png',
			alt: 'JSON에서 쉼표로 정보를 나누는 그림'
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '제이슨에서는 정보가 여러 개 있을 때 ' },
				{ text: '쉼표(,)', tone: 'blue' },
				{ text: '로 나누어요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [{ text: '쉼표가 없으면 컴퓨터는 어디에서 정보가 끝나는지 헷갈릴 수 있어요.' }]
		},
		{
			type: 'example',
			title: '쉼표가 필요한 모습',
			before: '정류장은 학교앞이고, 버스번호는 101번이야.',
			after: `{
  "정류장": "학교앞",
  "버스번호": "101"
}`
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '"정류장": "학교앞"', tone: 'amber' },
				{ text: ' 뒤에 다음 정보가 이어지기 때문에 ' },
				{ text: '쉼표', tone: 'blue' },
				{ text: '가 필요해요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [{ text: '하지만 마지막 정보 뒤에는 보통 쉼표를 붙이지 않아요.' }]
		},
		{
			type: 'tip',
			title: '기억할 점',
			items: [
				'정보가 여러 개이면 정보 사이에 쉼표(,)를 써요.',
				'쉼표는 다음 정보가 이어진다는 표시예요.',
				'마지막 정보 뒤에는 보통 쉼표를 붙이지 않아요.',
				'쉼표가 빠지면 JSON을 읽을 수 없을 때가 있어요.'
			]
		}
	],

	task: '"학교앞" 뒤에 빠진 쉼표를 넣고 실행하기를 눌러보세요.',
	initialCode: `{
  "정류장": "학교앞"
  "버스번호": "101",
  "도착예정분": 5,
  "곧도착": true
}`,
	answer: {
		정류장: '학교앞',
		버스번호: '101',
		도착예정분: 5,
		곧도착: true
	},
	hints: [
		'"정류장": "학교앞" 뒤에 쉼표가 필요해요.',
		'다음 줄에 "버스번호" 정보가 이어지고 있어요.',
		'정보와 정보 사이는 쉼표(,)로 나누어요.'
	]
};
