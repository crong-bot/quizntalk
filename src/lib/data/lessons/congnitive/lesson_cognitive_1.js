export default {
	slug: 'lesson_cognitive_1',
	title: '인공지능의 인식',
	category: 'AI교육',
	thumbnail: '/heart.png',
	summary: '사람과 인공지능의 인식 차이',
	published: true,

	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},

	steps: [
		{ kind: 'chat', role: 'teacher', text: '다음 사진은 무엇일까요?' },
		{
			kind: 'module',
			module: 'cognitive/cognitive11',
			props: { block: false, transition_delay: 200 }
		},
		{ kind: 'chat', role: 'student', text: '고양이요!' },
		{ kind: 'chat', role: 'teacher', text: '고양이인지 어떻게 알았나요?' },
		{ kind: 'chat', role: 'student', text: '음..그냥 사진을 보고 고양이가 떠올랐어요.' },
		{
			kind: 'chat',
			role: 'teacher',
			text: '그럼 인공지능은 눈이 없는데 어떻게 사진을 파악할까요?'
		},
		{ kind: 'chat', role: 'student', text: '카메라가 있으면 되요!' },
		{
			kind: 'chat',
			role: 'teacher',
			text: '그럼 인공지능은 인간처럼 뇌가 없는데 어떻게 사진을 바로 고양이라고 알까요?'
		},
		{ kind: 'chat', role: 'student', text: '인공지능이 알려줘요!' },
		{ kind: 'chat', role: 'teacher', text: '😖' },
		{ kind: 'chat', role: 'teacher', text: '...좋아요. 일단 인공지능이 인간과 같은 뇌는 없죠?' },
		{ kind: 'chat', role: 'student', text: '네!' },
		{
			kind: 'chat',
			role: 'teacher',
			text: '그럼 인공지능이 사진을 인식하는 방법은 사람과는 같지 않겠죠?'
		},
		{ kind: 'chat', role: 'student', text: '맞아요!' },
		{
			kind: 'chat',
			role: 'teacher',
			text: '다음 시간에는 인공지능이 사진을 인식하는 방법이 사람과 어떻게 다른지 알아볼거에요!'
		}
	]
};
