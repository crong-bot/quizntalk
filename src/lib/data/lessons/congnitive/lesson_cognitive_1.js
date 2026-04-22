export default {
	slug: 'lesson_cognitive_1',
	title: '인공지능의 인식',
	category: 'AI교육',
	thumbnail: '/heart.png',
	summary: '사람과 인공지능의 인식 차이',
	published: true,

	actors: {
		teacher: {
			name: '선생님',
			badges: ['선생님', '방장'],
			image: '/characters/teacher_default.png'
		},
		student: {
			name: '유헌수',
			badges: ['학생', '게스트'],
			image: '/characters/student_default.png'
		}
	},

	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '다음 사진은 무엇일까요?'
		},
		{
			kind: 'module',
			module: 'cognitive/cognitive11',
			props: { block: false, transition_delay: 200 }
		},
		{
			kind: 'choice',
			role: 'teacher',
			prompt: '무엇으로 보이나요?',
			saveAs: 'animal_guess',
			options: [
				{ value: 'cat', label: '고양이요!' },
				{ value: 'dog', label: '강아지요!' },
				{ value: 'unknown', label: '잘 모르겠어요.' }
			]
		},
		{
			kind: 'feedback',
			role: 'teacher',
			answerKey: 'animal_guess',
			variants: {
				cat: '좋아요! 많은 사람은 이 사진을 보고 고양이라고 생각해요.',
				dog: '그렇게 볼 수도 있겠네요. 왜 그렇게 생각했는지도 중요해요.',
				unknown: '괜찮아요. 헷갈릴 수 있어요. 이제 어떤 점을 보고 판단하는지 살펴볼게요.'
			},
			fallback: '좋아요. 같이 알아봅시다.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '고양이인지 어떻게 알았나요?'
		},
		{
			kind: 'choice',
			role: 'teacher',
			prompt: '왜 그렇게 생각했나요?',
			saveAs: 'reason_guess',
			options: [
				{ value: 'look', label: '사진을 보고 바로 떠올랐어요.' },
				{ value: 'feature', label: '귀나 얼굴 모양이 보여서요.' },
				{ value: 'unknown', label: '잘 설명은 못 하겠어요.' }
			]
		},
		{
			kind: 'feedback',
			role: 'teacher',
			answerKey: 'reason_guess',
			variants: {
				look: '맞아요. 사람은 본 경험과 기억으로 대상을 떠올리기도 해요.',
				feature: '좋아요. 사람은 특징을 보고 판단하기도 해요.',
				unknown: '괜찮아요. 설명은 못 해도 우리는 보고 느낌을 판단하곤 해요.'
			},
			fallback: '좋아요. 계속 생각해봅시다.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '그럼 인공지능은 눈이 없는데 어떻게 사진을 파악할까요?'
		},
		{
			kind: 'choice',
			role: 'teacher',
			prompt: '인공지능은 어떻게 알아볼까요?',
			saveAs: 'ai_guess',
			options: [
				{ value: 'camera', label: '카메라로 보면 바로 알아요.' },
				{ value: 'brain', label: '사람처럼 생각해서 알아요.' },
				{ value: 'unknown', label: '잘 모르겠어요.' }
			]
		},
		{
			kind: 'feedback',
			role: 'teacher',
			answerKey: 'ai_guess',
			variants: {
				camera: '비슷하지만, 카메라만 있다고 바로 아는 건 아니에요.',
				brain: '인공지능은 사람처럼 뇌로 이해하는 건 아니에요.',
				unknown: '좋아요. 오늘은 사람과 인공지능의 인식 방식이 다르다는 점만 먼저 알아도 충분해요.'
			},
			fallback: '좋아요. 사람과 인공지능의 인식 방식은 같지 않아요.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '다음 시간에는 인공지능이 사진을 인식하는 방법이 사람과 어떻게 다른지 알아볼 거예요!'
		}
	]
	// slug: 'lesson_cognitive_1',
	// title: '인공지능의 인식',
	// category: 'AI교육',
	// thumbnail: '/heart.png',
	// summary: '사람과 인공지능의 인식 차이',
	// published: true,

	// actors: {
	// 	teacher: { name: '선생님', badges: ['선생님', '방장'] },
	// 	student: { name: '유헌수', badges: ['학생', '게스트'] }
	// },

	// steps: [
	// 	{ kind: 'chat', role: 'teacher', text: '다음 사진은 무엇일까요?' },
	// 	{
	// 		kind: 'module',
	// 		module: 'cognitive/cognitive11',
	// 		props: { block: false, transition_delay: 200 }
	// 	},
	// 	{ kind: 'chat', role: 'student', text: '고양이요!' },
	// 	{ kind: 'chat', role: 'teacher', text: '고양이인지 어떻게 알았나요?' },
	// 	{ kind: 'chat', role: 'student', text: '음..그냥 사진을 보고 고양이가 떠올랐어요.' },
	// 	{
	// 		kind: 'chat',
	// 		role: 'teacher',
	// 		text: '그럼 인공지능은 눈이 없는데 어떻게 사진을 파악할까요?'
	// 	},
	// 	{ kind: 'chat', role: 'student', text: '카메라가 있으면 되요!' },
	// 	{
	// 		kind: 'chat',
	// 		role: 'teacher',
	// 		text: '그럼 인공지능은 인간처럼 뇌가 없는데 어떻게 사진을 바로 고양이라고 알까요?'
	// 	},
	// 	{ kind: 'chat', role: 'student', text: '인공지능이 알려줘요!' },
	// 	{ kind: 'chat', role: 'teacher', text: '😖' },
	// 	{ kind: 'chat', role: 'teacher', text: '...좋아요. 일단 인공지능이 인간과 같은 뇌는 없죠?' },
	// 	{ kind: 'chat', role: 'student', text: '네!' },
	// 	{
	// 		kind: 'chat',
	// 		role: 'teacher',
	// 		text: '그럼 인공지능이 사진을 인식하는 방법은 사람과는 같지 않겠죠?'
	// 	},
	// 	{ kind: 'chat', role: 'student', text: '맞아요!' },
	// 	{
	// 		kind: 'chat',
	// 		role: 'teacher',
	// 		text: '다음 시간에는 인공지능이 사진을 인식하는 방법이 사람과 어떻게 다른지 알아볼거에요!'
	// 	}
	// ]
};
