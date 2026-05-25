export const lesson08 = {
	id: 'lesson08',
	title: '상자 안의 상자: 자세한 정보 정리하기',
	conceptLabel: '상자 안의 상자',

	contentBlocks: [
		{
			type: 'image',
			src: '/images/lessson/lesson08_nested_object.png',
			alt: 'JSON에서 상자 안에 또 다른 정보 상자가 들어가는 그림'
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '제이슨에서는 정보 상자 ' },
				{ text: '{ }', tone: 'blue' },
				{ text: ' 안에 또 다른 정보 상자 ' },
				{ text: '{ }', tone: 'blue' },
				{ text: '를 넣을 수 있어요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '이렇게 하면 한 가지 정보를 더 ' },
				{ text: '자세하게', tone: 'emerald' },
				{ text: ' 정리할 수 있어요.' }
			]
		},
		{
			type: 'example',
			title: '장소 정보 안에 자세한 정보가 들어가는 모습',
			before: '전주한옥마을은 관광지이고, 지금 영업 중이야.',
			after: `{
  "장소": {
    "이름": "전주한옥마을",
    "종류": "관광지",
    "영업중": true
  }
}`
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '여기에서 ' },
				{ text: '"장소"', tone: 'rose' },
				{ text: '는 큰 정보의 이름표예요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '그리고 ' },
				{ text: '"장소"', tone: 'rose' },
				{ text: ' 안에는 ' },
				{ text: '"이름"', tone: 'amber' },
				{ text: ', ' },
				{ text: '"종류"', tone: 'amber' },
				{ text: ', ' },
				{ text: '"영업중"', tone: 'amber' },
				{ text: ' 같은 자세한 정보가 들어 있어요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '즉, ' },
				{ text: '"장소"', tone: 'rose' },
				{ text: '라는 상자 안에 또 다른 ' },
				{ text: '정보 상자', tone: 'blue' },
				{ text: '가 들어간 거예요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [{ text: '이런 구조를 쓰면 컴퓨터와 AI가 정보를 더 자세히 이해할 수 있어요.' }]
		},
		{
			type: 'tip',
			title: '기억할 점',
			items: [
				'정보 상자 안에 또 다른 정보 상자를 넣을 수 있어요.',
				'큰 정보 안에 자세한 정보를 묶어 넣을 때 사용해요.',
				'"장소" 안에 "이름", "종류", "영업중" 같은 정보를 넣을 수 있어요.',
				'안쪽 정보도 { }로 감싸요.',
				'상자가 여러 겹이면 괄호의 시작과 끝을 잘 확인해야 해요.'
			]
		}
	],

	task: '"이름", "종류", "영업중" 값을 완성하고 실행하기를 눌러보세요.',
	initialCode: `{
  "장소": {
    "이름": "",
    "종류": "",
    "영업중": false
  }
}`,
	answer: {
		장소: {
			이름: '전주한옥마을',
			종류: '관광지',
			영업중: true
		}
	},
	hints: [
		'"장소" 안에 또 다른 정보 상자가 들어 있어요.',
		'"이름"은 "전주한옥마을"로 써요.',
		'"종류"는 "관광지"로 써요.',
		'"영업중"은 true로 바꿔요.',
		'true는 큰따옴표 없이 써요.'
	]
};
