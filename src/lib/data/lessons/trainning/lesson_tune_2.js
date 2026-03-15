export default {
	slug: 'lesson_train_2',
	title: '학습 전과 후를 비교하자',
	category: '학습',
	thumbnail: '/test.png',
	summary: '학습 전과 후 정확도를 비교해요',
	published: true,
	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},
	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '이제 학습 전과 후를 비교해보자.'
		},
		{
			kind: 'module',
			module: 'learning/sign/train/before_after_test',
			props: { block: false }
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '정확도가 올랐다면 성공! 우리는 AI를 더 똑똑하게 만든 거야.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '오늘 정리: 숫자로 보고 → 규칙을 찾고 → 오차를 확인하고 → 중요도를 조정한다.'
		}
	]
};
