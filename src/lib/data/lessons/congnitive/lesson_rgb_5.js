export default {
	slug: 'lesson_rgb_5',
	title: 'RGB는 숫자로 표현해요',
	category: '학습',
	thumbnail: '/heart.png',
	summary: 'RGB 각 값이 0~255 숫자로 표현되고 세 숫자로 색이 결정된다는 개념 이해',
	published: true,

	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},

	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '다양한 색을 만들어 봤나요?'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '네 신기해요!'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '근데 아직 숫자로 표현한다는 게 뭔지 잘 모르겠어요...'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: 'RED를 하나도 섞지 않으면 숫자로 몇일까요?'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '0 인가요?'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '네 맞아요. 하나도 섞지 않으면 0, 최대로 섞으면 255로 정했어요.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '각 세 가지 색이 얼만큼 섞였는지 세 개의 숫자를 보고 컴퓨터는 판단해서 색을 나타내는 거에요.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '아 그렇구나!'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '헌수가 이번에 해보면 색이 얼만큼 섞이는지 숫자로 나올 거에요. 확인해보세요.'
		},
		{
			kind: 'module',
			module: 'rgb1/rgb15',
			props: { block: false }
		}
	]
};
