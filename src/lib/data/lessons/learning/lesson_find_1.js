export default // 1-1
{
	slug: 'lesson_find_1',
	title: '고양이 데이터의 공통점 찾기',
	category: '학습',
	thumbnail: '/cat.png',
	summary: '고양이 숫자 데이터에서 공통 규칙(특징)을 찾아요',
	published: true,
	actors: {
		teacher: { name: '선생님', badges: ['선생님', '방장'] },
		student: { name: '유헌수', badges: ['학생', '게스트'] }
	},
	steps: [
		{
			kind: 'chat',
			role: 'teacher',
			text: '여러분, 오늘은 우리가 자율주행 자동차 AI 개발자가 됩니다.'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '진짜요? 우리가 자동차를 만들어요?'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '네. 그런데 자동차가 스스로 운전하려면 꼭 필요한 기능이 있어요.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '만약 자동차가 이 표지판을 못 본다면 어떻게 될까요?'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '멈춰야 할 때 안 멈출 수도 있어요!'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '맞아요. 그래서 자율주행 자동차는 표지판을 정확하게 인식해야 합니다.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '그럼 이제 우리가 직접 표지판을 인식하는 AI를 만들어볼까요?'
		},
		{
			kind: 'chat',
			role: 'student',
			text: '어떻게 만들어요? 사람이 가르쳐줘야 하나요?'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '좋은 질문이에요. AI는 사람처럼 눈으로 이해하지 않아요.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: 'AI는 표지판을 다른 방식으로 봅니다. 바로 “숫자”로 바꿔서 학습해요.'
		},
		{
			kind: 'quiz',
			quiz: {
				questionNum: 1,
				type: 'multiple',
				question: 'AI는 표지판을 어떻게 학습할까요?',
				choices: [
					'그림을 그대로 이해한다',
					'색깔만 본다',
					'숫자로 바꿔서 학습한다',
					'사람이 대신 운전한다'
				],
				answerIndex: 2,
				explanation: 'AI는 이미지를 숫자로 변환해 벡터 형태로 학습합니다.'
			}
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '맞아요! AI는 그림을 그대로 이해하지 않아요.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '표지판을 작은 점(픽셀)으로 나누고, 그 점을 0과 1 같은 숫자로 바꿔서 학습합니다.'
		},
		{
			kind: 'chat',
			role: 'teacher',
			text: '그럼 이제 표지판을 숫자로 바꿔서 AI가 어떻게 보는지 직접 확인해봅시다.'
		}
	]
};
