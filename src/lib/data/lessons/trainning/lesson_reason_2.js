export default {
	slug: 'lesson_error_2',
	title: '오차가 클수록 더 많이 고친다',
	category: '학습',
	thumbnail: '/loss.png',
	summary: '정답과의 차이를 계산해 오차를 확인해요',
	published: true,
	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},
	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: 'AI는 틀린 정도를 오차 점수로 계산해.'
		},
		{
			kind: 'module',
			module: 'learning/sign/error/loss1',
			props: { block: false }
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '오차가 크면 더 많이 조정해야 한다는 뜻이야.'
		}
	]
};
