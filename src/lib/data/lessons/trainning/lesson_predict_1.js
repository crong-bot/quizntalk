export default {
	slug: 'lesson_predict_1',
	title: 'AI는 확률로 말한다',
	category: '학습',
	thumbnail: '/predict.png',
	summary: 'AI가 표지판을 보고 확률로 예측하는 과정을 체험해요',
	published: true,
	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},
	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '이제 표지판을 AI에게 보여주고 예측을 시켜보자.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: 'AI는 바로 정답을 말하나요?'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: 'AI는 확률로 말해. 가장 가능성이 높은 걸 선택하는 거야.'
		},
		{
			kind: 'module',
			module: 'training/predict/predict1',
			props: { block: false }
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '확률이 100%가 아닌 이유는 표지판이 항상 완벽하지 않기 때문이야.'
		}
	]
};
