export const lesson09 = {
	id: 'lesson09',
	title: '게임 캐릭터 생성하기',
	conceptLabel: '배열 안의 상자',
	successFeedback: {
		title: '캐릭터 카드들을 생성했습니다!',
		message: '배열안에는 상자들도 들어갈 수 있어요!',
		images: [
			{
				src: '/images/lessson/lesson09_card3.png',
				alt: 'card1'
			},
			{
				src: '/images/lessson/lesson09_card2.png',
				alt: 'card2'
			},
			
		]
	},
	contentBlocks: [
		{
			type: 'paragraph',
			parts: [
				{ text: '이제 지금까지 배운 내용을 모아서 ' },
				{ text: '게임 캐릭터 생성', tone: 'purple' },
				{ text: '을 해볼거에요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '전 단계에서는 하나의 캐릭터를 생성했다면 이번에는 여러 캐릭터를 생성할거에요.' },
			
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '그러기 위해서는 ' },
			{ text: '7 단계', tone: 'rose' },
			{ text: '에서 배운 ' },
			{ text: '배열', tone: 'blue' },
			{ text: '을 떠올려야 합니다. 배열에는 숫자나 문자가 들어갈 수 있었죠? 상자도 여러 개 들어갈 수 있습니다.' },
			]
		},	
		{
			type: 'example',
			title: '배열 안의 상자',
			before: '배열에 정보상자가 들어가는 예',
			after: `{ 
  "책": [
      {
  		"제목": "달빛 도서관의 고양이"
	  	"대여상태": "대여가능" 
	  },
	  {
  		"제목": "우주로 간 발명황"
	  	"대여상태": "대여불가" 
	  }    
  ]
}`
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '이렇게 ' },
				{ text: '배열', tone: 'blue' },
				{ text: ' 안에서 정보상자 사이에 ' },
				{ text: '(,)콤마', tone: 'rose' },
				{ text: '를 두어 여러 개 의 정보상자를 넣을 수 있습니다.' },
			]
		},	
		{
			type: 'paragraph',
			parts: [
				{ text: '결국  ' },
				{ text: '책', tone: 'green' },
				{ text: '이라는 ' },
				{ text: '키', tone: 'green' },
				{ text: '값에는 큰 ' },
				{ text: '배열', tone: 'blue' },
				{ text: ' 하나가 들어가는 것 입니다. ' },
			]
		},	
		{
			type: 'tip',
			title: '점검',
			items: [
				'글자 값은 큰따옴표 안에 써요.',
				'숫자 값은 큰따옴표 없이 써요.',
				'true와 false도 큰따옴표 없이 써요.',
				'여러 값은 목록 [ ] 안에 넣어요.',
				'정보와 정보 사이는 쉼표(,)로 나누어요.',
				'전체 정보는 { } 안에 담아요.'
			]
		}
	],

	task: '게임캐릭터 2개를 만들어봅시다. 첫 번째 캐릭터 이름은 불꽃용사, 직업은 전사, 레벨은 5, 잠금해제 true 입니다. 두 번째 캐릭터 이름은 얼음마법사, 직업은 마법사, 레벨은 4, 잠금해제 되지 않았습니다.',
	initialCode: `{
	"캐릭터":[]
}`,
	answer: {
		"캐릭터": [
			{
				"이름": "불꽃용사",
				"직업": "전사",
				"레벨": 5,
				"잠금해제": true
			},
			{
				"이름": "얼음마법사",
				"직업": "마법사",
				"레벨": 4,
				"잠금해제": false
			},
		]
	},
	hints: [
		'잠금해제는 true, false 둘 중 하나입니다.',
		'정보상자들 사이에 쉼표를 넣어주면 됩니다.'
	]
};
