export const lesson08 = {
	id: 'lesson08',
	title: '상자 안의 상자: 자세한 정보 정리하기',
	conceptLabel: '상자 안의 상자',
	successFeedback: {
	title: '캐릭터 카드를 생성했습니다!',
	message: '값에는 문자, 숫자, 정보상자, 여러가지가 들어갈 수 있어요!',
	images: [
		{
			src: '/images/lessson/lesson08_card1.png',
			alt: 'card1'
		},
		
		]
	},

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
			title: '값이 간단한 정보인 경우',
			before: '캐릭터 이름은 불꽃용사야',
			afterImage: '/images/lessson/lesson08_simple.png',
			afterImageAlt: '캐릭터의 값인 중괄호 상자 전체가 하이라이트된 예시'
		},
		{
			type: 'example',
			title: '값에 다른 상자가 들어간 경우',
			before: '캐릭터 이름은 불꽃용사고 직업은 전사, 레벨은 5야',
			afterImage: '/images/lessson/lesson08_complex.png',
			afterImageAlt: '캐릭터의 값인 중괄호 상자 전체가 하이라이트된 예시'
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '이렇게 더 자세한 값을 넣기 위해서는 값에 ' },
				{ text: '"상자"', tone: 'rose' },
				{ text: '가 들어갈 수 있습니다. 두 개의 ' },
				{ text: '"상자"', tone: 'rose' },
				{ text: '를 잘 비교해서 봐주세요.' }
			]
		},
		
		
		{
			type: 'tip',
			title: '기억할 점',
			items: [
				'정보 상자 안에 또 다른 정보 상자를 넣을 수 있어요.',
				'큰 정보 안에 자세한 정보를 묶어 넣을 때 사용해요.',
				'안쪽 정보도 { }로 감싸요.',
				'상자가 여러 겹이면 괄호의 시작과 끝을 잘 확인해야 해요.'
			]
		}
	],

	task: '캐릭터의 이름은 대지여왕이고 직업은 주술사, 레벨은 12 입니다. 해당 내용을 작성해보세요.',
	initialCode: `
`,
	answer: {
			"캐릭터": {
			"이름":"대지여왕",
			"직업": "주술사",
			"레벨":12
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
