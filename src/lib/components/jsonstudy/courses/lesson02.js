export const lesson02 = {
	id: 'lesson02',
	title: '키와 값: 정보 상자 안에 넣기',
	conceptLabel: '정보 상자와 키·값',

	guide: [
		'{ 는 정보 상자의 시작이에요.',
		'} 는 정보 상자의 끝이에요.',
		'키는 정보의 이름표예요.',
		'값은 이름표 옆에 적는 실제 정보예요.',
		'키와 값 사이에는 콜론(:)을 써요.'
	],

	keyboardGuide: [
		'{ 입력: Shift + [',
		'} 입력: Shift + ]',
		': 입력: Shift + ;',
		'" 입력: Shift + \''
	],
	contentBlocks: [
		{
			type: 'image',
			src: '/images/lessson/lesson02_keyvalue.png',
			alt: '정보 상자 안에 키와 값이 들어가는 그림'
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '제이슨은 정보를 ' },
				{ text: '{ }', tone: 'blue' },
				{ text: ' 안에 담아요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: ' {  ', tone: 'rose' },
				{ text: ' 는 정보 상자의 시작이고, ' },
				{ text: ' }  ', tone: 'rose' },
				{ text: ' 는 정보 상자의 끝이에요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '“취미”는 어떤 정보인지 알려주는 이름표이고, “독서”는 실제 내용이에요. ' }
				// { text: '"하늘초등학교"', tone: 'amber' },
				// { text: '라고만 쓰면, 이게 학교 이름인지 장소 이름인지 헷갈릴 수 있어요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: 'JSON은 정보를 이렇게 키와 값으로 정리해요. ' }
				// { text: '키', tone: 'rose' },
				// { text: '라는 이름표를 붙여요.' }
			]
		},
		// {
		// 	type: 'paragraph',
		// 	parts: [
		// 		{ text: '예를 들면 ' },
		// 		{ text: '"학교"', tone: 'rose' },
		// 		{ text: '는 이름표이고, ' },
		// 		{ text: '"하늘초등학교"', tone: 'amber' },
		// 		{ text: '는 실제 정보인 ' },
		// 		{ text: '값', tone: 'amber' },
		// 		{ text: '이에요.' }
		// 	]
		// },
		{
			type: 'paragraph',
			parts: [{ text: '키와 값 사이는 ' }, { text: ':', tone: 'blue' }, { text: ' 로 구분해요.' }]
		},
		// 		{
		// 			type: 'example',
		// 			title: '문장이 정리된 정보가 되는 모습',
		// 			before: '우리 학교는 하늘초등학교이고, 오늘 급식은 불고기야.',
		// 			after: `{
		//   "학교": "하늘초등학교",
		//   "오늘급식": "불고기"
		// }`
		// 		},
		{
			type: 'paragraph',
			parts: [
				{ text: '키는 항상 ' },
				{ text: '큰따옴표', tone: 'blue' },
				{ text: ' 안에 써요. 예: ' },
				{ text: '"점심"', tone: 'rose' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '값이 글자일 때도 ' },
				{ text: '큰따옴표', tone: 'blue' },
				{ text: ' 안에 써요. 예: ' },
				{ text: '"불고기"', tone: 'amber' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '하지만 값이 숫자라면 큰따옴표를 쓰지 않아요. 예: ' },
				{ text: '6', tone: 'emerald' }
			]
		},
		{
			type: 'imageModalButton',
			label: '키보드 입력 방법 보기',
			description: '{ } : " 같은 기호 위치를 그림으로 확인해보세요.',
			image: '/images/lessson/lesson02_keyboard.png',
			modalTitle: '키보드 입력 방법'
		},
		{
			type: 'tip',
			title: '기억할 점',
			items: [
				'제이슨 정보는 { } 안에 담아요.',
				'키는 정보의 이름표예요.',
				'값은 이름표 옆에 적는 실제 정보예요.',
				'키와 글자 값은 큰따옴표 안에 써요.',
				'키와 값 사이에는 콜론(:)을 써요.',
				'숫자 값에는 큰따옴표를 쓰지 않아요.'
			]
		}
	],

	task: '실행하기를 눌러보세요.',
	initialCode: `{
 	"취미": "독서"
}`,
	answer: {
		취미: '독서'
	},
	hints: [
		'전체 정보는 { } 안에 들어 있어요.',
		'"취미"는 키예요.',
		'"독서"는 값이에요.',
		'"취미": "독서"처럼 쓰면 어떤 정보인지 분명해져요.'
	]
};
