export default {
	slug: 'lesson_class_easy_1',
	title: '새 친구는 고양이일까 강아지일까?',
	category: '학습',
	thumbnail: '/quiz.png',
	summary: '찾은 규칙을 써서 새 데이터를 고양이/강아지로 구분해요',
	published: true,
	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},
	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '자, 이제 너는 “AI”야. 숫자 3개를 보고 고양이/강아지를 구분해볼 거야.'
		},
		{ kind: 'chat', role: 'student', text: '제가요? 오… 해볼게요!' },
		{
			kind: 'chat',
			role: 'teacher',
			text: '팁! 아까 만든 규칙을 떠올려. 귀/수염/꼬리 중 어떤 게 고양이 쪽이었지?'
		},

		{ kind: 'module', module: 'learning/catdog_classifier_1', props: { block: false } },

		{ kind: 'chat', role: 'teacher', text: '어때? 규칙이 있으면 생각보다 잘 맞히지?' },
		{ kind: 'chat', role: 'student', text: '맞아요! 근데 가끔 헷갈릴 것 같아요.' },
		{
			kind: 'chat',
			role: 'teacher',
			text: '정확해. 그래서 다음엔 일부러 “헷갈리는 데이터”를 섞어볼 거야.'
		}
	]
};
