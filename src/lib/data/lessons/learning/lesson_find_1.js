export default // 1-1
{
	slug: 'lesson_find_1',
	title: '고양이 데이터의 공통점 찾기',
	category: '학습',
	thumbnail: '/cat.png',
	summary: '고양이 숫자 데이터에서 공통 규칙(특징)을 찾아요',
	published: true,
	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},
	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '오늘은 고양이/강아지를 “숫자 3개”로 본다고 상상해볼 거에요.'
		},
		{ kind: 'chat', role: 'student', text: '동물을 숫자로요? 이상한데요?' },
		{
			kind: 'chat',
			role: 'teacher',
			text: '맞아, 진짜 숫자는 아니고 “특징 점수”라고 생각하면 돼. 예를 들어 귀/수염/꼬리 같은 거!'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '자, 지금부터는 “고양이 데이터”만 볼 거야. 공통점이 뭐가 보이니?'
		},
		{ kind: 'chat', role: 'student', text: '음… 귀랑 수염 숫자가 좀 큰 것 같아요.' },
		{
			kind: 'chat',
			role: 'teacher',
			text: '오! 관찰 시작 좋다. 그럼 후보 중에서 “고양이 규칙”을 골라서 만들어보자.'
		},

		{ kind: 'module', module: 'find/find1', props: { block: false } },

		{
			kind: 'chat',
			role: 'teacher',
			text: '좋아! 이렇게 “공통 특징”을 뽑아내는 게 규칙 찾기야.'
		},
		{ kind: 'chat', role: 'student', text: '그럼 AI도 이렇게 규칙을 만들어요?' },
		{
			kind: 'chat',
			role: 'teacher',
			text: '응. AI는 데이터를 많이 보고 “자주 나오는 특징”을 찾아서 규칙을 만들려고 해.'
		},
		{ kind: 'chat', role: 'teacher', text: '이제 강아지도 똑같이 해보면, 둘이 비교가 되겠지?' }
	]
};
