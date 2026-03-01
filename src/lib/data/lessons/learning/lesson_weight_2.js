export default {
	slug: 'lesson_feature_weight_2',
	title: '중요도를 바꾸면 결과도 바뀐다',
	category: '학습',
	thumbnail: '/slider.png',
	summary: '중요도(가중치)를 조절해 분류 결과와 정확도가 바뀌는 걸 체험해요',
	published: true,
	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},
	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '이제 진짜 AI처럼 해보자. “중요한 특징”에 더 점수를 주면 정확도가 올라갈 수 있어.'
		},
		{ kind: 'chat', role: 'student', text: '제가 점수를 조절해도 돼요?' },
		{
			kind: 'chat',
			role: 'teacher',
			text: '응! 슬라이더로 귀/수염/꼬리 중요도를 올렸다 내렸다 하면서 테스트해봐.'
		},
		{ kind: 'chat', role: 'teacher', text: '목표는 정확도 70% 넘기기!' },

		{ kind: 'module', module: 'learning/feature_weight_slider_2', props: { block: false } },

		{
			kind: 'chat',
			role: 'teacher',
			text: '좋아! 너희가 방금 한 게 AI가 학습할 때 하는 “조정”이야.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '오… AI도 이렇게 조금씩 맞춰가면서 똑똑해지는 거군요!'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '맞아. 오늘 한 줄 정리: “숫자에서 규칙을 찾고 → 규칙으로 구분하고 → 중요한 숫자를 조절한다!”'
		}
	]
};
