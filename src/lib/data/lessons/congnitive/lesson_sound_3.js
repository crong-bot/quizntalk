export default {
	slug: 'lesson_sound_3',
	title: '전기신호는 숫자가 돼요',
	category: '학습',
	thumbnail: '/heart.png',
	summary: '전기신호를 숫자로 저장하는 원리와 음악 파일 생성 과정 이해',
	published: true,

	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},

	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '컴퓨터는 마이크가 만든 이 전기신호를 숫자로 바꾸어서 저장할 수 있어요.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '그럼 그게 음악 파일이 되는 건가요?'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '네, 맞아요!'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '이 과정을 거꾸로 하면 숫자를 전기신호로 바꾸고, 전기신호를 다시 소리로 바꾸게 돼요. 그게 바로 음악 재생이에요.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '오! 신기해요!'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '전기신호를 숫자로 만드는 과정은 복잡하지만, 간단히 보여줄게요.'
		},
		{
			kind: 'module',
			module: 'sound1/sound31',
			props: { block: false }
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '그래프가 위로 높으면 숫자가 높고, 아래로 낮으면 숫자가 낮아요.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '이렇게 전기신호를 잘게 쪼갠 다음 숫자로 바꾸어 준답니다. 실제로는 저것보다 훨씬 더 길겠죠.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '그래프를 직접 만져보면서 숫자가 어떻게 변하는지 관찰해보세요.'
		}
	]
};
