export default {
	slug: 'lesson_error_1',
	title: 'AI는 어디를 보고 판단했을까?',
	category: '학습',
	thumbnail: '/focus.png',
	summary: 'AI가 중요하게 본 부분을 확인해요',
	published: true,
	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},
	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: 'AI가 틀렸다면 왜 틀렸는지 찾아야 해.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: 'AI가 어디를 보고 판단했는지 알 수 있어요?'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '중요하게 본 픽셀을 표시해보자.'
		},
		{
			kind: 'module',
			module: 'learning/sign/error/replay1_focusmap',
			props: { block: false }
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '핵심 특징을 놓치면 오답이 나올 수 있어.'
		}
	]
};
