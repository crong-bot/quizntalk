export default {
	slug: 'lesson_class_hard_2',
	title: '헷갈리는 친구들 분류하기',
	category: '학습',
	thumbnail: '/hard.png',
	summary: '애매한 데이터도 분류해보고 왜 헷갈렸는지 생각해요',
	published: true,
	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},
	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '이번엔 난이도 업! 숫자가 고양이/강아지 특징이 “섞여” 있을 거야.'
		},
		{ kind: 'chat', role: 'student', text: '그럼 정답이 애매하겠는데요…?' },
		{
			kind: 'chat',
			role: 'teacher',
			text: '맞아. 근데 AI도 현실에서 이런 애매한 상황을 자주 만나.'
		},
		{ kind: 'chat', role: 'teacher', text: '해보면서 “왜 헷갈렸는지” 생각해보자.' },

		{ kind: 'module', module: 'learning/catdog_classifier_2', props: { block: false } },

		{ kind: 'chat', role: 'teacher', text: '어땠어? 어떤 문제에서 특히 헷갈렸어?' },
		{ kind: 'chat', role: 'student', text: '귀는 고양이 같은데 꼬리는 강아지 같은 애요!' },
		{
			kind: 'chat',
			role: 'teacher',
			text: '바로 그 지점이 핵심이야. 그럴 때는 “더 중요한 숫자(특징)”를 잘 골라야 해.'
		},
		{ kind: 'chat', role: 'teacher', text: '다음은 어떤 특징이 더 중요한지 직접 골라보자.' }
	]
};
