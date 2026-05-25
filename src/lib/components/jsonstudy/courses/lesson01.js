export const lesson01 = {
	id: 'lesson01',
	type: 'intro',
	title: 'AI는 무엇을 보고 배울까?',
	conceptLabel: 'AI와 정보',
	contentBlocks: [
		{
			type: 'image',
			src: '/images/lessson/lesson01_intro.png',
			alt: 'AI와 데이터, JSON의 관계를 보여주는 그림'
		},
		{
			type: 'paragraph',
			parts: [
				{ text: 'AI가 모든 것을 아는 존재처럼 보이지만, 사실 AI도 ' },
				{ text: '데이터', tone: 'blue' },
				{ text: '를 보고 배우고, 데이터를 바탕으로 대답해요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '글, 숫자, 그림, 기록처럼 여러 정보가 AI의 ' },
				{ text: '재료', tone: 'emerald' },
				{ text: '가 돼요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '실제 AI 서비스에서는 이런 데이터를 정리해서 주고받을 때 ' },
				{ text: 'JSON 같은 형식', tone: 'rose' },
				{ text: '을 많이 사용해요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: '그래서 JSON을 배우는 것은 단순한 ' },
				{ text: '코딩 문법 연습', tone: 'amber' },
				{ text: '이 아니에요.' }
			]
		},
		{
			type: 'paragraph',
			parts: [
				{ text: 'JSON을 배우는 것은 AI 시대에 실제로 쓰이는 ' },
				{ text: '데이터의 모양', tone: 'blue' },
				{ text: '을 직접 경험하는 일이에요.' }
			]
		},
		{
			type: 'tip',
			title: '기억할 점',
			items: [
				'AI는 마법이 아니라 데이터를 보고 배우는 컴퓨터 기술이에요.',
				'AI가 좋은 대답을 하려면 좋은 데이터가 필요해요.',
				'실제 AI 서비스와 프로그램은 데이터를 주고받을 때 JSON 같은 형식을 많이 사용해요.',
				'JSON을 배우면 AI가 사용하는 데이터의 구조를 직접 경험할 수 있어요.'
			]
		}
	],
	introSentence: '우리 반 민수는 6학년이고, 좋아하는 과목은 과학이야.',
	introJson: `{
  "이름": "민수",
  "학년": 6,
  "좋아하는과목": "과학"
}`,
	introCards: [
		{
			title: 'AI는 데이터로 배워요',
			text: 'AI는 갑자기 똑똑해지는 것이 아니에요. 글, 숫자, 그림, 기록 같은 많은 데이터를 보고 배우고, 그 안에서 규칙과 의미를 찾아요.'
		},
		{
			title: 'AI 서비스도 데이터를 주고받아요',
			text: 'AI 챗봇, 번역기, 추천 앱, 게임 같은 서비스는 사용자의 질문, 설정, 결과 같은 정보를 컴퓨터가 읽을 수 있는 데이터로 주고받아요.'
		},
		{
			title: 'JSON은 실제로 쓰이는 데이터 형식이에요',
			text: 'JSON은 정보를 이름표와 값으로 정리하는 형식이에요. 앱과 웹사이트, 게임, AI 서비스에서 데이터를 저장하거나 주고받을 때 실제로 많이 사용돼요.'
		}
	],

	realWorldExamples: [
		'AI 챗봇: 질문, 역할, 대답 조건, 이전 대화',
		'번역 AI: 원문, 언어, 번역 결과',
		'추천 서비스: 사용자 취향, 본 영상, 추천 목록',
		'게임 AI: 캐릭터 상태, 체력, 위치, 행동',
		'학교 앱: 학생 이름, 학년, 반, 출석 상태'
	],
	takeaway:
		'AI 시대에는 말로 질문하는 힘도 중요하지만, AI와 컴퓨터가 사용할 수 있는 데이터의 모양을 이해하는 힘도 중요해요. JSON은 실제 프로그램과 AI 서비스에서 많이 쓰이는 데이터 형식이기 때문에, JSON을 배우면 AI 시대의 진짜 데이터 구조를 경험할 수 있어요.',

	task: '이번 단계에서는 JSON을 직접 작성하지 않아요. 먼저 AI가 왜 데이터를 필요로 하는지, 그리고 JSON이 왜 실제 AI 서비스와 프로그램에서 자주 쓰이는 데이터 형식인지 생각해보세요.',

	hints: [
		'AI는 데이터를 보고 배우고 대답해요.',
		'JSON은 실제 프로그램에서 쓰이는 데이터 형식이에요.',
		'JSON은 정보를 이름표와 값으로 정리해요.'
	],
	quiz: {
		question: '초등학생이 제이슨을 배우는 가장 중요한 이유는 무엇일까요?',
		options: [
			{
				id: 'a',
				text: '1. 어려운 프로그래밍 문법을 많이 외우기 위해서'
			},
			{
				id: 'b',
				text: '2. AI 시대에 정보를 잘 읽고, 정리하고, 전달하는 힘을 기르기 위해서'
			},
			{
				id: 'c',
				text: '3. 컴퓨터 게임을 더 빨리 하기 위해서'
			}
		],
		answerId: 'b',
		successMessage: '맞아요! 제이슨은 AI 시대에 정보를 잘 정리하는 힘을 기르기 위한 도구예요.',
		failMessage: '조금 아쉬워요. 제이슨은 문법 암기가 아니라 정보를 잘 정리하는 힘과 연결돼요.'
	}
};
