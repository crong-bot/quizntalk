export default {
	slug: 'lesson_find_2',
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
			text: '이제 표지판을 숫자로 바꿔보겠습니다.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '표지판을 아주 작은 점, 즉 픽셀로 나눠볼게요.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '점으로 나누면 그냥 모자이크처럼 보일 것 같아요!'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '맞아요! AI는 그 점 하나하나를 숫자로 바꿔서 봅니다.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '검은색은 1, 흰색은 0처럼 바꿀 수 있어요.'
		},

		{
			kind: 'chat',
			role: 'teacher',
			text: '지금 보이는 0과 1이 바로 AI가 보는 숫자입니다.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '그리고 이 숫자들을 한 줄로 쭉 펼친 것을 벡터라고 해요.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '아! 그래서 숫자가 한 줄로 길게 늘어났군요!'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '이 벡터가 AI 안으로 들어가서 학습을 시작합니다.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '이제 우리는 숫자를 이용해 규칙을 찾는 단계로 가보겠습니다.'
		}
	]
};
