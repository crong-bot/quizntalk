export default {
	slug: 'lesson_rgb_1',
	title: '사진은 점으로 보여요',
	category: '학습',
	thumbnail: '/heart.png',
	summary: '모니터의 사진/그림이 픽셀(점)로 표현된다는 개념 이해',
	published: true,

	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},

	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '컴퓨터는 사진이나 그림을 모니터에 어떻게 보여줄까요?'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '모르겠어요... 그냥 나오는 거 아닌가요?'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '사실은 “점”으로 표현한답니다.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '점이요?'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '네. “픽셀”이라고도 해요. “픽셀아트”는 들어봤죠?'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '아니요. 근데 그러려면 점이 엄청 많이 필요하겠네요?'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '맞아요. 다음 사진을 볼까요?'
		},
		{
			kind: 'module',
			module: 'rgb1/rgb11',
			props: { block: false }
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '사진 하나의 크기를 모니터라고 생각해보세요. 점이 많을수록 더 자세한 사진이 보이겠죠?'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '컴퓨터는 이렇게 많은 점의 색깔을 바꾸어 주면서 사진을 표현한답니다.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '다음 시간에는 컴퓨터가 점의 색깔을 어떻게 바꾸어 주는지 알아볼게요!',
			onEnd: 'AlertLessonEnd'
		}
	]
};
