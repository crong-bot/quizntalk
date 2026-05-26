export const lesson06 = {
	id: 'lesson06',
	title: 'true와 false: 상태 표현하기',
	conceptLabel: 'true / false',

	contentBlocks: [
		{
			type: 'image',
			src: '/images/lessson/lesson06_boolean.png',
			alt: 'true와 false로 상태를 표현하는 그림'
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '제이슨에서는 어떤 상태가 ' },
				{ text: '맞는지', tone: 'emerald' },
				{ text: ', 또는 ' },
				{ text: '아닌지', tone: 'rose' },
				{ text: '를 나타낼 때 ' },
				{ text: 'true', tone: 'emerald' },
				{ text: '와 ' },
				{ text: 'false', tone: 'rose' },
				{ text: '를 써요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '예를 들어 ' },
				{ text: '배달중', tone: 'rose' },
				{ text: '이면 ' },
				{ text: 'true', tone: 'emerald' },
				{ text: ', 아직 도착하지 않았으면 ' },
				{ text: '도착완료', tone: 'rose' },
				{ text: '는 ' },
				{ text: 'false', tone: 'rose' },
				{ text: '가 돼요.' }
			]
		},
		{
			type: 'example',
			title: '상태 값이 들어가는 모습',
			before: '떡볶이가 배달 중이고, 아직 도착하지 않았어.',
			after: `{
  "메뉴": "떡볶이",
  "배달중": true,
  "도착완료": false
}`
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '여기에서 ' },
				{ text: 'true', tone: 'emerald' },
				{ text: '는 맞다, 켜짐, 진행 중 같은 상태를 나타낼 수 있어요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '반대로 ' },
				{ text: 'false', tone: 'rose' },
				{ text: '는 아니다, 꺼짐, 아직 안 됨 같은 상태를 나타낼 수 있어요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '중요한 점은 ' },
				{ text: 'true', tone: 'emerald' },
				{ text: '와 ' },
				{ text: 'false', tone: 'rose' },
				{ text: '에는 ' },
				{ text: '큰따옴표를 쓰지 않는 것', tone: 'blue' },
				{ text: '이에요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '즉, ' },
				{ text: 'true', tone: 'emerald' },
				{ text: '는 상태 값이고, ' },
				{ text: '"true"', tone: 'amber' },
				{ text: '는 글자 값이에요.' }
			]
		},
		{
			type: 'tip',
			title: '기억할 점',
			items: [
				'true는 맞다, 켜짐, 진행 중 같은 상태를 나타낼 수 있어요.',
				'false는 아니다, 꺼짐, 아직 안 됨 같은 상태를 나타낼 수 있어요.',
				'true와 false에는 큰따옴표를 쓰지 않아요.',
				'"true"처럼 쓰면 상태 값이 아니라 글자 값이 돼요.',
				'상태를 정확히 쓰면 앱과 AI가 상황을 더 잘 이해할 수 있어요.'
			]
		}
	],

	task: '배달앱은 서버에서 고객의 배달 상태 정보를 JSON으로 받아 화면에 보여줘요. 현재 배달 중이고 아직 도착하지 않은 상태예요. 앱은 서버에서 어떤 JSON을 받았을까요? "배달중"과 "도착완료"의 값을 써보세요.',
	initialCode: `{
  "메뉴": "떡볶이",
  "배달중":     
  "도착완료":
}`,
	answer: {
		메뉴: '떡볶이',
		배달중: true,
		도착완료: false
	},
	hints: [
		'"메뉴"는 그대로 두세요.',
		'"배달중"은 true로 바꿔야 해요.',
		'"도착완료"는 false로 바꿔야 해요.',
		'true와 false는 큰따옴표 없이 써요.'
	]
};
