export const lesson07 = {
	id: 'lesson07',
	title: '목록: 여러 값을 차례대로 담기',
	conceptLabel: '목록',

	contentBlocks: [
		{
			type: 'image',
			src: '/images/lessson/lesson07_array.png',
			alt: 'JSON에서 목록을 대괄호 안에 담는 그림'
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '제이슨에서는 여러 값을 한곳에 모을 때 ' },
				{ text: '목록', tone: 'blue' },
				{ text: '을 사용해요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '목록은 ' },
				{ text: '[ ]', tone: 'blue' },
				{ text: ' 안에 값을 차례대로 넣어요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '예를 들어 급식 메뉴가 여러 개라면, 하나씩 따로 쓰는 것보다 ' },
				{ text: '목록으로 묶는 것', tone: 'emerald' },
				{ text: '이 보기 좋아요.' }
			]
		},
		{
			type: 'example',
			title: '급식 메뉴가 목록이 되는 모습',
			before: '오늘 급식은 쌀밥, 미역국, 불고기, 김치야.',
			after: `{
  "급식": ["쌀밥", "미역국", "불고기", "김치"]
}`
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '여기에서 ' },
				{ text: '"급식"', tone: 'rose' },
				{ text: '은 키이고, ' },
				{ text: '["쌀밥", "미역국", "불고기", "김치"]', tone: 'blue' },
				{ text: '는 목록 값이에요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '목록 안의 값들은 ' },
				{ text: '쉼표(,)', tone: 'blue' },
				{ text: '로 나누어요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '목록 안에 들어간 음식 이름은 글자 값이니까 ' },
				{ text: '큰따옴표', tone: 'amber' },
				{ text: ' 안에 써요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '즉, 목록은 ' },
				{ text: '여러 값을 차례대로 담는 상자', tone: 'emerald' },
				{ text: '라고 생각하면 쉬워요.' }
			]
		},
		{
			type: 'tip',
			title: '기억할 점',
			items: [
				'목록은 [ ]로 감싸요.',
				'목록 안에는 여러 값을 넣을 수 있어요.',
				'목록 안의 값들은 쉼표(,)로 나누어요.',
				'글자 값은 큰따옴표 안에 써요.',
				'급식 메뉴, 준비물, 알림 목록처럼 여러 개의 정보를 담을 때 좋아요.'
			]
		}
	],

	task: '학교 알림앱은 선생님이 입력한 준비물을 JSON으로 받아 학생 화면에 보여줘요. 내일 준비물은 색연필, 가위, 풀, 물통이에요. "준비물" 목록에 필요한 물건들을 차례대로 넣어보세요.',
	initialCode: `{
  "알림": "내일 준비물",
  "준비물": [ ]
}`,
	answer: {
		알림: '내일 준비물',
		준비물: ['색연필', '가위', '풀', '물통']
	},
	hints: [
		'여러 준비물은 [ ] 안에 목록으로 넣어요.',
		'준비물 이름은 글자 값이라 큰따옴표 안에 써요.',
		'값이 여러 개이면 쉼표(,)로 구분해요.'
	]
};
