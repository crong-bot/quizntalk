export default {
	slug: 'lesson_rgb_4',
	title: 'RGB 표현법 이해하기',
	category: '학습',
	thumbnail: '/heart.png',
	summary: 'Red, Green, Blue 세 가지 색의 조합으로 색을 표현하는 원리 이해',
	published: true,

	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},

	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: 'red, green, blue 이렇게 세 가지 색이 들어간 정도에 따라서 색을 표현해요.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '각 색의 앞글자를 따서 RGB 표현법이라고 한답니다.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '아직 잘 이해가 안 돼요!'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '그럼 헌수가 직접 red, green, blue 색깔을 조정해보면서 다양한 색을 한 번 만들어봐요!'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '네. 해볼게요.'
		},
		{
			kind: 'module',
			module: 'rgb1/rgb14',
			props: { block: false }
		}
	]
};
