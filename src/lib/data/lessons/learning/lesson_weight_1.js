export default {
	slug: 'lesson_weight_1',
	title: '어떤 숫자가 가장 중요할까?',
	category: '학습',
	thumbnail: '/star.png',
	summary: '분류에 중요한 특징(숫자)을 골라보며 AI의 특징 선택을 이해해요',
	published: true,
	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},
	steps: [
		{ kind: 'chat', role: 'teacher', text: '헌수야, AI는 모든 숫자를 똑같이 보지 않아.' },
		{ kind: 'chat', role: 'student', text: '왜요?' },
		{
			kind: 'chat',
			role: 'teacher',
			text: '어떤 숫자는 “정답을 맞히는 데” 더 도움이 되거든. 그걸 “중요한 특징”이라고 해.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '귀/수염/꼬리 중에서 뭐가 제일 중요할지 골라보고, 그거만 보고 맞혀볼 거야.'
		},

		{ kind: 'module', module: 'learning/weight/weight1', props: { block: false } },

		{
			kind: 'chat',
			role: 'teacher',
			text: '어때? 하나만 보고 맞히면 쉬운 것도 있지만, 부족할 때도 있지?'
		},
		{ kind: 'chat', role: 'student', text: '네! 그래서 여러 개를 같이 봐야겠어요.' },
		{
			kind: 'chat',
			role: 'teacher',
			text: '정답! 그래서 마지막 단계는 “중요도를 조절해서 더 잘 맞히기”야.'
		}
	]
};
