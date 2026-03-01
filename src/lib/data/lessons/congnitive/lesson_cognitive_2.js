export default {
	slug: 'lesson_cognitive_2',
	title: '인공지능은 숫자로 인식해요',
	category: '학습',
	thumbnail: '/heart.png',
	summary: '인공지능은 모든 것을 숫자로 바꿔 인식한다는 개념 이해',
	published: true,

	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},

	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '인공지능은 모든 걸 숫자로 해요. 숫자로 인식하고 숫자로 학습하고요.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '무슨 말인지 잘 모르겠어요..'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '사진도 숫자로 파악한다는 말이에요.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '다음 사진을 볼까요.'
		},
		{
			kind: 'module',
			module: 'cognitive/cognitive21',
			props: { block: false }
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '무슨 사진인가요?'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '하트요!'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '잘했어요!'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '그럼 컴퓨터는 이걸 어떻게 인식하는지 다음 사진을 봅시다!'
		},
		{
			kind: 'module',
			module: 'cognitive/cognitive22',
			props: { block: false }
		},
		{
			kind: 'module',
			module: 'cognitive/cognitive23',
			props: { block: false }
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '잘했어요! 중요한 건 인공지능이 모든 것을 숫자로 바꾸어서 인식한다는 거에요.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '그럼 소리도 숫자로 파악하나요?'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '와, 정말 좋은 질문이에요! 우리도 점점 더 똑똑해지고 있네요!'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '네. 사진, 음성, 글자 모든 것을 숫자로 인식한답니다.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '인공지능이 숫자를 사용해서 인식하는 방법에 대해 앞으로 자세히 공부해볼거에요.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '네.'
		}
	]
};
