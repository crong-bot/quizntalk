export const lesson09 = {
	id: 'lesson09',
	title: '좋은 정보 만들기: 오류 고치기',
	conceptLabel: '오류 고치기',

	contentBlocks: [
		{
			type: 'image',
			src: '/images/lessson/lesson09_error_fix.png',
			alt: 'JSON 오류를 고치는 그림'
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '제이슨은 정보를 정리하는 방법이지만, ' },
				{ text: '모양이 정확해야', tone: 'blue' },
				{ text: ' 컴퓨터가 읽을 수 있어요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '쉼표가 빠지거나, 글자 값에 큰따옴표가 빠지면 ' },
				{ text: '오류', tone: 'rose' },
				{ text: '가 날 수 있어요.' }
			]
		},
		{
			type: 'example',
			title: '오류가 있는 정보',
			before: '학교 알림 앱에서 체험학습 안내를 보내려고 해요.',
			after: `{
  "앱": "학교알림"
  "제목": 체험학습 안내,
  "읽음": false,
  "중요": true
}`
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '위 코드에는 두 가지 문제가 있어요. 첫째, ' },
				{ text: '"학교알림"', tone: 'amber' },
				{ text: ' 뒤에 ' },
				{ text: '쉼표', tone: 'blue' },
				{ text: '가 빠졌어요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '둘째, ' },
				{ text: '체험학습 안내', tone: 'amber' },
				{ text: '는 글자 값인데 ' },
				{ text: '큰따옴표', tone: 'blue' },
				{ text: ' 안에 들어가 있지 않아요.' }
			]
		},
		{
			type: 'example',
			title: '올바르게 고친 모습',
			before: '쉼표와 큰따옴표를 고치면 이렇게 돼요.',
			after: `{
  "앱": "학교알림",
  "제목": "체험학습 안내",
  "읽음": false,
  "중요": true
}`
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '좋은 정보는 ' },
				{ text: '정확한 모양', tone: 'emerald' },
				{ text: '으로 정리되어 있어야 해요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: 'AI와 컴퓨터가 정보를 잘 이해하려면, 사람이 먼저 정보를 바르게 정리해야 해요.' }
			]
		},
		{
			type: 'tip',
			title: '기억할 점',
			items: [
				'정보와 정보 사이에는 쉼표(,)가 필요해요.',
				'글자 값은 큰따옴표 안에 써요.',
				'true와 false는 큰따옴표 없이 써요.',
				'숫자 값도 큰따옴표 없이 써요.',
				'오류가 나면 쉼표, 큰따옴표, 괄호를 먼저 확인해요.'
			]
		}
	],

	task: '빠진 쉼표와 큰따옴표를 고쳐서 올바른 제이슨으로 만들고 실행하기를 눌러보세요.',
	initialCode: `{
  "앱": "학교알림"
  "제목": 체험학습 안내,
  "읽음": false,
  "중요": true
}`,
	answer: {
		앱: '학교알림',
		제목: '체험학습 안내',
		읽음: false,
		중요: true
	},
	hints: [
		'"학교알림" 뒤에 쉼표가 필요해요.',
		'체험학습 안내는 글자 값이라 "체험학습 안내"처럼 큰따옴표 안에 써야 해요.',
		'false와 true는 상태 값이라 큰따옴표 없이 그대로 써요.'
	]
};
