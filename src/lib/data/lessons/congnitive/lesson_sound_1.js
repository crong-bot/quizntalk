export default {
	slug: 'lesson_sound_1',
	title: '소리는 진동이에요',
	category: '학습',
	thumbnail: '/heart.png',
	summary: '소리의 전달 원리와 인공지능에서 “귀” 역할(마이크/센서) 이해',
	published: true,

	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},

	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '소리가 진동인 것은 알고 있나요?'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '네! 과학시간에 배웠어요!'
		},
		{
			kind: 'module',
			module: 'sound1/sound11',
			props: { block: false }
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '이렇게 소리의 진동이 공기를 타고 달팽이관에 닿으면 달팽이관은 이 진동을 뇌에 신호로 전달해서 우리가 소리를 인식하게 해요.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '그럼 인공지능에서 귀의 역할을 하는 것은 무엇일까요?'
		},
		{
			kind: 'quiz',
			quiz: {
				type: 'multiple',
				question: '다음 중 인공지능에서 귀의 역할을 하는 것은 무엇일까요?',
				example: true
			}
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '네 맞았어요! 잘했어요.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '다음 시간에는 컴퓨터가 점의 색깔을 어떻게 바꾸어 주는지에 대해 알아볼게요!'
		}
	]
};
