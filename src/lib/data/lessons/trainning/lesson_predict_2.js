export default {
	slug: 'lesson_predict_2',
	title: '헷갈리면 확률이 흔들린다',
	category: '학습',
	thumbnail: '/noise.png',
	summary: '표지판에 노이즈를 주면 예측 확률이 달라지는 걸 체험해요',
	published: true,
	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},
	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '이번엔 일부러 표지판을 헷갈리게 만들어볼게.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '비가 오거나 흐릿하면 픽셀이 바뀔 수 있어.'
		},
		{
			kind: 'module',
			module: 'training/predict/_NoisePredictorCore',
			props: { block: false }
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '노이즈가 커질수록 확률이 흔들리는 걸 봤지?'
		}
	]
};
