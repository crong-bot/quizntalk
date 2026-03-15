export default {
	slug: 'lesson_train_1',
	title: '중요도를 조정해보자',
	category: '학습',
	thumbnail: '/slider.png',
	summary: '중요도를 바꾸면 예측 결과가 달라져요',
	published: true,
	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},
	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '이제 진짜 AI처럼 해보자. 중요한 특징에 더 점수를 주면 결과가 달라질 수 있어.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '제가 점수를 조절해도 돼요?'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '응! 슬라이더로 중요도를 조절해보자.'
		},
		{
			kind: 'module',
			module: 'learning/sign/train/train_step1',
			props: { block: false }
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '지금 한 게 바로 AI의 학습 과정이야.'
		}
	]
};
