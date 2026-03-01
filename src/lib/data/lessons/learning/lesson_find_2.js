export default {
	slug: 'lesson_rule_dog_2',
	title: '강아지 데이터의 공통점 찾기',
	category: '학습',
	thumbnail: '/dog.png',
	summary: '강아지 숫자 데이터의 공통 규칙을 찾아 고양이와 비교해요',
	published: true,
	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},
	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '이번엔 “강아지 데이터”야. 고양이랑 뭐가 다를지 찾아볼까?'
		},
		{ kind: 'chat', role: 'student', text: '강아지는 꼬리가 더 큰가요?' },
		{ kind: 'chat', role: 'teacher', text: '가능성 있어! 숫자를 보고 진짜 그런지 확인해보자.' },
		{
			kind: 'chat',
			role: 'teacher',
			text: '아까처럼 공통점 후보를 골라서 “강아지 규칙”을 만들어봐.'
		},

		{ kind: 'module', module: 'learning/catdog_rule_2', props: { block: false } },

		{
			kind: 'chat',
			role: 'teacher',
			text: '좋아! 이제 고양이 규칙과 강아지 규칙이 둘 다 생겼다.'
		},
		{ kind: 'chat', role: 'student', text: '규칙이 있으면 이제 맞힐 수 있겠는데요?' },
		{
			kind: 'chat',
			role: 'teacher',
			text: '바로 그거야. 다음은 “새 친구”를 보고 고양이인지 강아지인지 구분해볼 거야!'
		}
	]
};
