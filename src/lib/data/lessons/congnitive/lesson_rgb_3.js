export default {
	slug: 'lesson_rgb_3',
	title: 'RGB로 색을 섞어봐요',
	category: '학습',
	thumbnail: '/heart.png',
	summary: '컴퓨터가 RGB 세 가지 색을 섞어 숫자로 색을 표현한다는 개념 이해',
	published: true,

	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},

	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '컴퓨터가 숫자로 색을 표현하는 방법에 대해 알아볼거에요.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '네!'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '지난 시간에도 말했듯이 색에 각각 숫자를 붙여주기엔 색이 너무 많아요.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '그래서 컴퓨터는 세 가지 색을 섞어서 표현해요.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '모르겠어요...'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '아이클레이를 섞으면 색이 변하듯이 컴퓨터는 세 가지 색을 섞어서 표현해요. 다음 색을 보고 영어로 한 번 써볼까요?'
		},
		{
			kind: 'module',
			module: 'rgb1/rgb13',
			props: {
				block: true,
				answer: ['red', 'green', 'blue']
			}
		}
	]
};
