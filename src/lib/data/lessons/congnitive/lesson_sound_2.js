export default {
	slug: 'lesson_sound_2',
	title: '소리는 전기신호로 바뀌어요',
	category: '학습',
	thumbnail: '/heart.png',
	summary: '마이크가 소리(진동)를 전기신호로 바꾸고, 신호의 크기/높낮이 차이를 이해',
	published: true,

	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},

	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '마이크는 소리의 진동을 전기신호로 바꾸는 역할을 해요.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '무슨 말인지 잘 모르겠어요..'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '예를 보여줄게요.'
		},
		{
			kind: 'module',
			module: 'sound1/sound21',
			props: { block: false }
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '소리는 진동이라고 했죠? 그 진동을 이렇게 그래프로 나타내는 거에요.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '꼭 파도 같아요.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '파도 비슷하죠? 소리마다 이 모양은 서로 다 달라요.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '그럼 문제를 맞춰볼까요?'
		},
		{
			kind: 'quiz',
			quiz: {
				questionNum: 1,
				type: 'photo',
				question: '다음 전기신호 중 더 큰 소리는 무엇일까요?',
				photosRef: 'photos'
			}
		},
		{
			kind: 'quiz',
			quiz: {
				questionNum: 2,
				type: 'photo',
				question: '다음 전기신호 중 더 높은 소리는 무엇일까요?',
				photosRef: 'photos2'
			}
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '너무 잘했어요. 이렇게 소리마다 전기신호의 모양이 다르답니다.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '다음 시간에는 전기신호를 숫자로 바꾸는 과정에 대해 알아볼게요.'
		}
	]
};
