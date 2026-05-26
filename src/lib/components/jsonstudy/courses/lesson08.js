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

	task: '날씨앱은 서버에서 오늘 날씨 정보를 JSON으로 받아 화면에 보여줘요. 오늘 New York의 날씨는 맑음이고, 기온은 24도이며, 비는 오지 않아요. "날씨" 상자 안에 자세한 정보를 완성해보세요.',
	initialCode: `{
  "지역": "New York",
  "날씨": {
    "상태": "",
    "기온": 0,
    "비오는중": true
  }
}`,
	answer: {
		지역: 'New York',
		날씨: {
			상태: '맑음',
			기온: 24,
			비오는중: false
		}
	},
	hints: [
		'"날씨" 안에 자세한 정보 상자가 들어 있어요.',
		'"상태"는 "맑음"으로 써요.',
		'"기온"은 숫자 값이라 큰따옴표 없이 24로 써요.',
		'"비오는중"은 false로 바꿔요.',
		'false는 큰따옴표 없이 써요.'
	]
};
