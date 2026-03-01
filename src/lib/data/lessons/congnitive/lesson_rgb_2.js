export default {
	slug: 'lesson_rgb_2',
	title: '컴퓨터는 색을 어떻게 숫자로 바꿀까요?',
	category: '학습',
	thumbnail: '/heart.png',
	summary: '사람의 색 인식과 컴퓨터의 색 표현 방식 비교',
	published: true,

	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},

	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '사람들은 모니터의 색을 다음과 같이 인식해요.'
		},
		{
			kind: 'module',
			module: 'rgb1/rgb12-1',
			props: { block: false }
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '사람들은 무슨 색인지 이렇게 바로 알지만 컴퓨터는 1과 0밖에 알아듣지 못해요.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '그럼 이 색깔을 숫자로 바꾸어 주나요?'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '네 헌수는 정말 똑똑하군요! 각 색마다 숫자를 만들어주면 될까요?'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '그러기엔 색깔이 너무 많은 것 같은데요?'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '네 맞아요. 헌수는 천재인 것 같아요.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '다음 그림을 보면 컴퓨터가 어떻게 색을 숫자로 바꾸는지 알 수 있어요.'
		},
		{
			kind: 'module',
			module: 'rgb1/rgb12-2',
			props: { block: false }
		},
		{
			kind: 'chat',
			role: 'student',
			text: '모르겠어요.. 무슨 원리인지...'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '컴퓨터가 색을 인식하고 표현하는 방법은 다양해요. 가장 쉬운 방법을 다음 시간에 배워볼 거예요!'
		}
	]
};
