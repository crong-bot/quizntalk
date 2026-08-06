<!-- src/routes/help/+page.svelte -->
<script>
	const learningGroups = [
		{
			title: 'JSON의 필요성',
			start: 1,
			span: 1
		},
		{
			title: '기본 입력값',
			start: 2,
			span: 5
		},
		{
			title: '복잡한 입력값',
			start: 7,
			span: 3
		},
		{
			title: '디버깅',
			start: 10,
			span: 1
		}
	];

	const learningSteps = [
		{
			number: 1,
			label: 'AI와 정보',
			title: 'AI는 무엇을 보고 배울까?',
			content: 'AI와 앱이 데이터를 사용하는 이유와 정보를 JSON으로 정리하는 필요성을 알아봅니다.',
			mission:
				'AI에게 데이터가 왜 중요하고, 프로그램에서 JSON을 사용하는 이유가 무엇인지 생각합니다.',
			answer: 'AI 시대에 정보를 잘 읽고, 정리하고, 전달하는 힘을 기르기 위해서'
		},
		{
			number: 2,
			label: '키와 값',
			title: '정보 상자 안에 넣기',
			content: '중괄호 안에 키와 값을 넣고, 키와 값 사이에 콜론을 사용하는 기본 구조를 배웁니다.',
			mission: '취미 키와 독서 값을 가진 JSON을 살펴보고 키와 값을 구분합니다.',
			answer: `{
  "취미": "독서"
}`
		},
		{
			number: 3,
			label: '글자 값',
			title: '큰따옴표 안에 넣기',
			content: '글자로 된 값은 큰따옴표 안에 작성하는 방법을 배웁니다.',
			mission: '"좋아하는과목" 키의 값을 "과학"으로 완성합니다.',
			answer: `{
  "좋아하는과목": "과학"
}`
		},
		{
			number: 4,
			label: '쉼표',
			title: '여러 정보를 나누기',
			content: '하나의 JSON 안에 여러 정보가 있을 때 쉼표로 구분하는 방법을 배웁니다.',
			mission: '정류장 정보 뒤에 빠진 쉼표를 찾아 수정합니다.',
			answer: `{
  "정류장": "학교앞",
  "버스번호": "101",
  "도착예정분": 5,
  "곧도착": true
}`
		},
		{
			number: 5,
			label: '숫자 값',
			title: '큰따옴표 없이 쓰기',
			content: '가격이나 개수처럼 계산할 수 있는 숫자는 큰따옴표 없이 작성합니다.',
			mission: '무선이어폰의 가격을 29000, 재고를 12로 입력합니다.',
			answer: `{
  "상품명": "무선이어폰",
  "가격": 29000,
  "재고": 12
}`
		},
		{
			number: 6,
			label: 'true / false',
			title: '상태 표현하기',
			content: '진행 중, 완료 여부 같은 상태를 true와 false로 표현하는 방법을 배웁니다.',
			mission: '배달중은 true, 도착완료는 false로 입력합니다.',
			answer: `{
  "메뉴": "떡볶이",
  "배달중": true,
  "도착완료": false
}`
		},
		{
			number: 7,
			label: '배열',
			title: '여러 값을 차례대로 담기',
			content: '하나의 키에 여러 값을 넣을 때 대괄호 배열을 사용하는 방법을 배웁니다.',
			mission: '색연필, 가위, 풀, 물통을 준비물 배열에 넣습니다.',
			answer: `{
  "알림": "내일 준비물",
  "준비물": ["색연필", "가위", "풀", "물통"]
}`
		},
		{
			number: 8,
			label: '상자 안의 상자',
			title: '자세한 정보 정리하기',
			content: '하나의 값 안에 또 다른 객체를 넣어 자세한 정보를 정리합니다.',
			mission: '대지여왕 캐릭터의 이름, 직업, 레벨을 객체 안에 작성합니다.',
			answer: `{
  "캐릭터": {
    "이름": "대지여왕",
    "직업": "주술사",
    "레벨": 12
  }
}`
		},
		{
			number: 9,
			label: '배열 안의 상자',
			title: '게임 캐릭터 생성하기',
			content: '배열 안에 여러 객체를 넣어 여러 대상의 정보를 한 번에 정리합니다.',
			mission: '불꽃용사와 얼음마법사 캐릭터 두 개를 배열 안에 작성합니다.',
			answer: `{
  "캐릭터": [
    {
      "이름": "불꽃용사",
      "직업": "전사",
      "레벨": 5,
      "잠금해제": true
    },
    {
      "이름": "얼음마법사",
      "직업": "마법사",
      "레벨": 4,
      "잠금해제": false
    }
  ]
}`
		},
		{
			number: 10,
			label: '디버깅',
			title: '오류 메시지 읽기',
			content: '오류 메시지를 보고 큰따옴표, 쉼표, 배열, true와 false 오류를 하나씩 수정합니다.',
			mission: '오류가 있는 게임 캐릭터 JSON을 실행하고 틀린 부분을 모두 고칩니다.',
			answer: `{
  "캐릭터이름": "번개검사",
  "레벨": 5,
  "아이템": ["나무검", "회복물약", "방패"],
  "체력": 80,
  "접속중": true
}`
		}
	];

	const individualTemplates = [
		{
			id: 'class',
			label: '학교생활',
			title: '모둠원 정보 만들기',
			summary: '모둠원의 번호, 취미, 안경 여부를 배열과 객체로 정리합니다.',
			grammar: ['숫자', '문자열', 'true / false', '배열', '객체'],
			flow: ['모둠원 정보 조사', '자료형 구분', '배열 안에 객체 작성', '문법 확인'],
			example: {
				모둠정보: [
					{
						번호: 2,
						취미: '독서',
						안경여부: true
					},
					{
						번호: 7,
						취미: '게임',
						안경여부: true
					}
				]
			},
			checks: [
				'번호는 숫자로 작성합니다.',
				'취미는 문자열로 작성합니다.',
				'안경여부는 true 또는 false로 작성합니다.',
				'모둠원 한 명의 정보는 객체 하나로 작성합니다.'
			]
		},
		{
			id: 'lunchSurvey',
			label: '학급 조사',
			title: '급식 선호 조사 JSON 제출',
			summary: '친구들의 급식 선호를 조사하고 숫자, 목록, 문자열, 참·거짓으로 정리합니다.',
			grammar: ['숫자', '문자열', 'true / false', '배열', '중첩 객체'],
			flow: ['친구 3명 이상 조사', '인기 메뉴 정리', '자료형 구분', 'JSON 제출'],
			example: {
				급식선호조사: {
					조사인원: 5,
					인기메뉴: ['떡볶이', '돈가스', '비빔밥'],
					가장인기메뉴: '떡볶이',
					채소반찬선호: false
				}
			},
			checks: [
				'조사인원은 숫자로 작성합니다.',
				'인기메뉴는 배열로 작성합니다.',
				'가장인기메뉴는 문자열로 작성합니다.',
				'채소반찬선호는 true 또는 false로 작성합니다.'
			]
		},
		{
			id: 'complimentTrainingData',
			label: 'AI 학습데이터',
			title: '칭찬 문장 AI 학습데이터 만들기',
			summary: '칭찬 문장과 사용 경험을 AI 학습데이터 형태로 작성합니다.',
			grammar: ['문자열', 'true / false', '배열', '객체'],
			flow: ['칭찬 문장 생각하기', '사용 경험 판단', '문장 객체 작성', '배열 완성'],
			example: {
				칭찬문장학습데이터: [
					{
						칭찬말: '친구를 잘 도와주었어.',
						사용한경험: true
					},
					{
						칭찬말: '끝까지 포기하지 않았어.',
						사용한경험: false
					}
				]
			},
			checks: [
				'칭찬말은 문자열로 작성합니다.',
				'사용한경험은 true 또는 false로 작성합니다.',
				'문장 정보 객체를 배열 안에 넣습니다.',
				'놀리거나 기분 나쁜 문장은 사용하지 않습니다.'
			]
		},
		{
			id: 'spellingTrainingData',
			label: 'AI 학습데이터',
			title: '맞춤법 교정 AI 학습데이터 만들기',
			summary: '틀린 표현과 바른 표현을 짝지어 AI 학습데이터로 작성합니다.',
			grammar: ['문자열', '배열', '객체'],
			flow: ['헷갈리는 표현 찾기', '정답 확인', '오류·정답 객체 작성', '배열 완성'],
			example: {
				맞춤법교정학습데이터: [
					{
						오류: '안되요',
						정답: '안 돼요'
					},
					{
						오류: '몇일',
						정답: '며칠'
					}
				]
			},
			checks: [
				'오류와 정답은 모두 문자열로 작성합니다.',
				'맞춤법 정보 객체를 배열 안에 넣습니다.',
				'정확하지 않은 표현은 검색하거나 책에서 확인합니다.',
				'마지막 값 뒤에 불필요한 쉼표를 넣지 않습니다.'
			]
		},
		{
			id: 'lostItemRegister',
			label: '학교생활',
			title: '학교 분실물 앱 등록 JSON 만들기',
			summary: '실제 분실물을 객체, 배열, 참·거짓 값으로 등록합니다.',
			grammar: ['문자열', 'true / false', '배열', '중첩 객체'],
			flow: ['분실물 관찰', '정보 분류', '특징 배열 작성', '등록 JSON 완성'],
			example: {
				분실물등록: {
					물건: '체육복 상의',
					색깔: '남색',
					특징: ['왼쪽 소매에 흰 줄 있음', '이름표 없음'],
					긴급알림필요: true
				}
			},
			checks: [
				'물건과 색깔은 문자열로 작성합니다.',
				'특징은 배열로 작성합니다.',
				'긴급알림필요는 true 또는 false로 작성합니다.',
				'실제 학생 이름이나 개인정보는 사용하지 않습니다.'
			]
		},
		{
			id: 'school',
			label: '학교생활',
			title: '학교 알림 데이터 만들기',
			summary: '여러 학교 알림을 배열 안의 객체로 작성합니다.',
			grammar: ['문자열', 'true / false', '배열', '객체', '빈 배열'],
			flow: ['알림 정보 확인', '자료형 구분', '알림 객체 작성', '알림목록 완성'],
			example: {
				앱: '학교알림',
				알림목록: [
					{
						제목: '체험학습 안내',
						대상: '5학년',
						날짜: '2026-06-12',
						중요알림: true,
						준비물: ['도시락', '물', '운동화']
					}
				]
			},
			checks: [
				'알림목록은 배열로 작성합니다.',
				'각 알림은 객체로 작성합니다.',
				'중요알림은 true 또는 false로 작성합니다.',
				'준비물이 없으면 빈 배열로 작성합니다.'
			]
		}
	];

	const teamThemes = [
		{
			id: 'moon-base',
			group: 'write',
			groupLabel: '팀 작성',
			icon: '🪐',
			title: '달 기지 복구',
			subtitle: '역할별 JSON 명령으로 멈춘 달 기지 시스템을 복구합니다.',
			meta: '4인 모둠 · JSON 새싹',
			overview: {
				activity: '전력, 산소, 통신, 탐사로봇 장치를 역할별로 복구합니다.',
				collaboration: '각자 맡은 장치 정보를 작성하고 마지막에 역할별 최종값을 공유합니다.',
				submission: '숫자, 문자열, 참·거짓 값을 합친 최종 시스템 JSON',
				flow: ['기지 접속', '전원 연결', '최종값 공유', '시스템 동기화']
			},
			roles: [
				['⚡', '전력 담당', '전력센터와 최종 전력값'],
				['O₂', '산소 담당', '산소센터와 최종 산소값'],
				['📡', '통신 담당', '통신안테나와 통신코드'],
				['🤖', '탐사로봇 담당', '로버 장치와 준비 상태']
			],
			missions: [
				{
					title: '기지 접속',
					studentAction: '자기 역할의 기지번호와 접속코드를 JSON으로 작성합니다.',
					share: '이 단계에서는 각자 자기 역할의 값을 사용합니다.',
					answers: {
						전력: {
							기지번호: '전력-01',
							접속코드: 1204
						},
						산소: {
							기지번호: '산소-01',
							접속코드: 2108
						},
						통신: {
							기지번호: '통신-01',
							접속코드: 3407
						},
						탐사로봇: {
							기지번호: '로버-01',
							접속코드: 5521
						}
					},
					checks: [
						'기지번호는 문자열입니다.',
						'접속코드는 숫자입니다.',
						'각 학생의 접속코드가 서로 다릅니다.'
					]
				},
				{
					title: '전원 연결',
					studentAction: '담당 장치의 이름, 연결 상태, 전압을 작성합니다.',
					share: '각 학생은 자기 장치에 맞는 전압을 사용합니다.',
					answers: {
						전력: {
							장치: '전력센터',
							연결: true,
							전압: 220
						},
						산소: {
							장치: '산소센터',
							연결: true,
							전압: 110
						},
						통신: {
							장치: '통신안테나',
							연결: true,
							전압: 48
						},
						탐사로봇: {
							장치: '탐사로봇',
							연결: true,
							전압: 24
						}
					},
					checks: [
						'연결 값은 문자열이 아니라 true입니다.',
						'전압은 숫자로 작성합니다.',
						'학생마다 담당 장치와 전압이 다릅니다.'
					]
				},
				{
					title: '최종 시스템 동기화',
					studentAction: '팀원에게 역할별 값을 물어보고 최종 JSON을 완성합니다.',
					share: '전력 100, 산소 true, 통신코드 AD32, 탐사로봇 true를 공유합니다.',
					answers: {
						전력: 100,
						산소: true,
						통신코드: 'AD32',
						탐사로봇: true
					},
					checks: [
						'전력은 숫자 100입니다.',
						'통신코드는 문자열 "AD32"입니다.',
						'산소와 탐사로봇은 true입니다.',
						'팀원끼리 값을 공유해야 전체 JSON을 완성할 수 있습니다.'
					]
				}
			]
		},
		{
			id: 'robot-cockpit',
			group: 'write',
			groupLabel: '팀 작성',
			icon: '🤖',
			title: '로봇 조종석',
			subtitle: '역할별 조종 정보를 작성해 로봇의 미사일 발사 명령을 완성합니다.',
			meta: '4인 모둠 · JSON 초급',
			overview: {
				activity: '조종석에 접속하고 장치를 켠 뒤 미사일 발사 정보를 완성합니다.',
				collaboration: '파일럿, 센서, 무기, 기술 담당이 서로 다른 값을 맡습니다.',
				submission: '목표, 좌표, 무기, 발사각도를 합친 JSON',
				flow: ['조종석 입장', '장치 전원', '발사값 공유', '미사일 발사']
			},
			roles: [
				['🧑‍✈️', '파일럿', '조종석 입장 정보'],
				['📡', '센서 담당', '목표와 좌표'],
				['🚀', '무기 담당', '무기 종류'],
				['🛠️', '기술 담당', '발사 각도']
			],
			missions: [
				{
					title: '조종석 입장',
					studentAction: '파일럿 아이디와 입장 코드를 입력합니다.',
					share: '입장에 필요한 문자열과 숫자를 구분합니다.',
					answers: {
						파일럿아이디: '25KE-415',
						입장코드: 31735
					},
					checks: ['파일럿아이디는 문자열입니다.', '입장코드는 숫자입니다.']
				},
				{
					title: '장치 전원 켜기',
					studentAction: 'HUD 전원을 켜진 상태로 설정합니다.',
					share: 'true의 입력 방법을 확인합니다.',
					answers: {
						HUD전원: true
					},
					checks: ['true에 큰따옴표를 사용하지 않습니다.']
				},
				{
					title: '미사일 발사',
					studentAction: '팀원의 값을 모아 최종 발사 명령을 작성합니다.',
					share: '목표, 좌표, 무기, 발사각도를 서로 공유합니다.',
					answers: {
						목표: '붉은타워',
						좌표: 'B7',
						무기: '미사일',
						발사각도: 24
					},
					checks: [
						'발사각도는 숫자입니다.',
						'네 가지 정보가 모두 들어가야 합니다.',
						'모둠원이 같은 최종 명령을 확인합니다.'
					]
				}
			]
		},
		{
			id: 'monster-defense',
			group: 'write',
			groupLabel: '팀 작성',
			icon: '👾',
			title: '괴물 도시 방어',
			subtitle: '괴물을 정찰하고 역할별 방어 정보를 모아 도시를 지킵니다.',
			meta: '4인 모둠 · JSON 초급',
			overview: {
				activity: '괴물의 종류와 방향을 파악하고 알맞은 방어 수단을 준비합니다.',
				collaboration: '정찰, 시설, 함정, 무기 담당의 정보를 하나로 합칩니다.',
				submission: '괴물과 방어 정보를 합친 최종 JSON',
				flow: ['괴물 정찰', '방어 준비', '정보 공유', '도시 방어']
			},
			roles: [
				['🔭', '정찰 담당', '괴물과 접근 방향'],
				['🧱', '시설 담당', '방어 시설'],
				['🕸️', '함정 담당', '함정 종류'],
				['🔥', '무기 담당', '사용할 무기']
			],
			missions: [
				{
					title: '괴물 정찰',
					studentAction: '괴물 종류와 접근 방향을 확인합니다.',
					share: '괴물과 방향 정보를 모둠에 공유합니다.',
					answers: {
						괴물: '초록괴물',
						방향: '북쪽'
					},
					checks: ['괴물과 방향의 키를 바꾸지 않았는지 확인합니다.']
				},
				{
					title: '방어 준비',
					studentAction: '방어 시설, 함정, 무기를 준비합니다.',
					share: '각 담당자가 선택한 방어 정보를 공유합니다.',
					answers: {
						방어시설: '성벽',
						함정: '그물트랩',
						무기: '불대포'
					},
					checks: [
						'함정과 무기를 바꾸어 입력하지 않습니다.',
						'각 값이 알맞은 키에 들어가야 합니다.'
					]
				},
				{
					title: '최종 방어',
					studentAction: '모든 정보를 하나로 합쳐 도시 방어 명령을 완성합니다.',
					share: '괴물, 방향, 시설, 함정, 무기의 다섯 값을 공유합니다.',
					answers: {
						괴물: '초록괴물',
						방향: '북쪽',
						방어시설: '성벽',
						함정: '그물트랩',
						무기: '불대포'
					},
					checks: [
						'다섯 가지 정보가 모두 들어가야 합니다.',
						'모둠원 모두가 같은 결과를 확인합니다.'
					]
				}
			]
		},
		{
			id: 'lost-item-team',
			group: 'write',
			groupLabel: '팀 작성',
			icon: '🎒',
			title: '분실물 찾기',
			subtitle: '역할별 분실물 정보를 등록해 하나의 분실물 목록을 완성합니다.',
			meta: '4인 모둠 · JSON 초급',
			overview: {
				activity: '분실물 관리 기준을 정하고 학생마다 맡은 분실물을 등록합니다.',
				collaboration: '각 학생이 다른 분실물을 추가하되 기존 정보를 지우지 않아야 합니다.',
				submission: '네 개의 분실물 객체가 들어 있는 배열',
				flow: ['관리자 접속', '분류 기준', '역할별 등록', '전체 목록 확인']
			},
			roles: [
				['1', '학생 1', '첫 번째 분실물'],
				['2', '학생 2', '두 번째 분실물'],
				['3', '학생 3', '세 번째 분실물'],
				['4', '학생 4', '네 번째 분실물']
			],
			missions: [
				{
					title: '관리자 접속',
					studentAction: '분실물 관리 화면에 접속합니다.',
					share: '모둠원이 같은 관리 화면에 들어왔는지 확인합니다.',
					conditions: ['관리자 접속 상태가 정상이어야 합니다.'],
					checks: ['학생이 올바른 방에 입장했는지 확인합니다.']
				},
				{
					title: '분류 기준 설정',
					studentAction: '분실물을 나눌 기준을 확인합니다.',
					share: '모둠원이 같은 분류 기준을 사용합니다.',
					conditions: ['분류 기준 설정이 완료되어야 합니다.'],
					checks: ['학생마다 분류 기준을 다르게 이해하지 않는지 확인합니다.']
				},
				{
					title: '분실물 등록',
					studentAction: '자기 역할의 분실물 객체를 목록에 추가합니다.',
					share: '친구가 먼저 등록한 자료를 유지하면서 새 객체를 추가합니다.',
					conditions: [
						'분실물 객체가 네 개 모두 있어야 합니다.',
						'기존 분실물 정보가 사라지지 않아야 합니다.',
						'여러 분실물은 배열 안에 있어야 합니다.'
					],
					example: {
						분실물목록: [
							{
								물건: '파란색 필통',
								발견장소: '도서관'
							},
							{
								물건: '검정 우산',
								발견장소: '급식실'
							}
						]
					},
					checks: [
						'학생이 전체 목록을 덮어쓰지 않는지 확인합니다.',
						'공용화면에 네 개의 분실물이 모두 표시되어야 합니다.'
					]
				}
			]
		},
		{
			id: 'time-museum',
			group: 'write',
			groupLabel: '팀 작성',
			icon: '🏛️',
			title: '유물정보 복구 작전',
			subtitle: '시대별 유물정보 오류를 찾고 팀원의 복구값을 모아 시스템을 복구합니다.',
			meta: '4인 모둠 · JSON 중급',
			overview: {
				activity: '선사, 삼국, 고려, 조선 유물정보의 오류를 찾아 수정합니다.',
				collaboration: '자기 시대의 복구값을 찾고 다른 시대 값은 팀원에게 물어봅니다.',
				submission: '네 시대의 복구값이 들어 있는 역할별 복구명령',
				flow: ['오류 찾기', '유물정보 수정', '복구값 공유', '전체 복구명령']
			},
			roles: [
				['🪨', '선사 유물 담당', '선사시대 오류와 복구값'],
				['👑', '삼국 유물 담당', '삼국시대 오류와 복구값'],
				['🏺', '고려 유물 담당', '고려시대 오류와 복구값'],
				['📜', '조선 유물 담당', '조선시대 오류와 복구값']
			],
			missions: [
				{
					title: '내 시대의 오류 찾기',
					studentAction: '자기 시대 유물정보에서 오류 종류를 찾습니다.',
					share: '각자 자기 시대의 오류만 판단합니다.',
					answers: {
						선사: '이름 오류',
						삼국: '시대 오류',
						고려: '종류 오류',
						조선: '배치 오류'
					},
					checks: ['오류 종류와 수정값을 구분합니다.', '학생은 자기 역할의 자료를 분석합니다.']
				},
				{
					title: '잘못된 유물정보 수정',
					studentAction: '담당시대와 수정할 유물의 이름·종류를 작성합니다.',
					share: '각 시대의 정상 유물정보를 확인합니다.',
					answers: {
						선사시대: {
							이름: '주먹도끼',
							종류: '석기'
						},
						삼국시대: {
							이름: '신라 금관',
							종류: '장신구'
						},
						고려시대: {
							이름: '청자 매병',
							종류: '도자기'
						},
						조선시대: {
							이름: '대동여지도',
							종류: '지도'
						}
					},
					checks: ['담당시대와 수정유물 객체를 유지합니다.', '자기 시대의 유물만 수정합니다.']
				},
				{
					title: '전체 복구명령 완성',
					studentAction: '자기 시대 값은 유지하고 나머지 값을 팀원에게 물어봅니다.',
					share: '주먹도끼, 장신구, 청자 매병, 대동여지도를 공유합니다.',
					answers: {
						선사시대: '주먹도끼',
						삼국시대: '장신구',
						고려시대: '청자 매병',
						조선시대: '대동여지도'
					},
					checks: [
						'각 역할의 최상위 키는 복구명령-01부터 04까지 서로 다릅니다.',
						'각 복구명령 안에는 네 시대 값이 모두 들어가야 합니다.',
						'팀원 3명 또는 4명의 복구값을 모아야 합니다.'
					]
				}
			]
		},
		{
			id: 'animal-rescue',
			group: 'read',
			groupLabel: '팀 해석',
			icon: '🐾',
			title: '동물구조대: 늑구 추적 작전',
			subtitle: '서로 다른 JSON 단서를 모아 늑구가 숨어 있는 곳을 추리합니다.',
			meta: '4인 모둠 · JSON 해석',
			overview: {
				activity: '제보, 흔적, 행동, 안전 자료를 분석해 늑구의 위치를 찾습니다.',
				collaboration: '각 역할이 중요한 단서를 하나씩 찾고 팀원에게 설명합니다.',
				submission: '늑구가 숨어 있는 장소와 판단 이유',
				flow: ['역할별 단서 분석', '중요 단서 제출', '후보 장소 비교', '늑구 위치 결정']
			},
			roles: [
				['📢', '제보 분석 대원', '신뢰도 높은 목격 제보'],
				['🐾', '흔적 분석 대원', '젖은 발자국과 이동 방향'],
				['🧠', '행동 분석 대원', '늑구가 숨기 쉬운 환경'],
				['🛟', '안전 분석 대원', '구조하기 안전한 조건']
			],
			missions: [
				{
					title: '역할별 JSON 단서 찾기',
					studentAction: '각자 맡은 JSON을 비교해 팀에 알려 줄 핵심 단서를 고릅니다.',
					share: '제보, 흔적, 행동, 안전 조건을 역할별로 공유합니다.',
					answers: {
						제보: '파란 목줄을 한 회색 늑구가 물소리 나는 쪽으로 이동함',
						흔적: '젖은 발자국이 물소리 나는 쪽으로 이어짐',
						행동: '어둡고 조용한 곳에 숨기 쉬움',
						안전조건: '사람이 적은 곳이 구조하기 좋음'
					},
					checks: [
						'장소를 바로 맞히는 것이 아니라 중요한 단서를 먼저 찾습니다.',
						'각 답에는 자료를 근거로 한 이유가 있어야 합니다.'
					]
				},
				{
					title: '팀 단서로 늑구 위치 정하기',
					studentAction: '팀 단서와 후보 장소의 특징을 비교해 위치를 결정합니다.',
					share: '물소리, 젖은 길, 어두움, 조용함, 사람이 적음이라는 조건을 모읍니다.',
					answers: {
						늑구가있는곳: '하천 옆 수로',
						그렇게생각한이유:
							'물소리가 나고 젖은 길이 있으며 어둡고 조용하고 사람이 적기 때문입니다.'
					},
					checks: [
						'후보 장소의 여러 특징을 팀 단서와 비교합니다.',
						'정답 장소뿐 아니라 판단 이유도 작성해야 합니다.'
					]
				}
			]
		},
		{
			id: 'bike-rebalance',
			group: 'read',
			groupLabel: '팀 해석',
			icon: '🚲',
			title: '따릉이 데이터 분석대',
			subtitle: '네 가지 이용 데이터를 모아 자전거를 먼저 보충할 대여소를 찾습니다.',
			meta: '4인 모둠 · 실제 데이터',
			overview: {
				activity: '대여소, 지역, 이용자, 시기별 이용건수를 비교합니다.',
				collaboration: '각 역할이 가장 큰 값을 찾고 네 단서를 하나의 후보 대여소와 연결합니다.',
				submission: '보충할 대여소와 확인한 네 가지 단서',
				flow: ['역할별 최댓값 찾기', '이용 단서 공유', '후보 대여소 비교', '보충 대여소 결정']
			},
			roles: [
				['📍', '대여소 분석가', '가장 많이 이용된 대여소'],
				['🗺️', '지역 분석가', '대여가 가장 많은 자치구'],
				['👥', '이용자 분석가', '이용이 가장 많은 대여권'],
				['📅', '시기 분석가', '이용이 가장 많은 달']
			],
			missions: [
				{
					title: '역할별 JSON 단서 찾기',
					studentAction: '배열 안의 이용건수를 비교해 가장 큰 값과 같은 객체의 항목을 찾습니다.',
					share: '대여소, 지역, 대여권, 시기 단서를 공유합니다.',
					answers: {
						대여소: {
							이름: '마곡나루역 2번 출구',
							이용건수: 86780
						},
						지역: {
							이름: '강서구',
							대여건수: 3274017
						},
						이용자: {
							대여권: '정기권',
							이용건수: 16480345
						},
						시기: {
							월: '2025년 9월',
							이용건수: 3992326
						}
					},
					checks: [
						'가장 큰 숫자와 같은 객체 안의 값을 함께 읽습니다.',
						'항목과 이용건수를 모두 제출합니다.'
					]
				},
				{
					title: '따릉이 보충 대여소 정하기',
					studentAction: '후보 대여소와 네 가지 팀 단서를 비교합니다.',
					share: '강서구, 정기권, 9월, 마곡나루역 2번 출구라는 단서를 연결합니다.',
					answers: {
						보충할대여소: '마곡나루역 2번 출구',
						확인한단서:
							'가장 많이 이용된 대여소이며 강서구에 있고 정기권 이용자와 9월 이용 조건이 일치합니다.'
					},
					checks: [
						'하나의 단서만 보고 판단하지 않습니다.',
						'네 가지 단서와 후보 대여소 정보를 연결합니다.'
					]
				}
			]
		},
		{
			id: 'market-basket',
			group: 'read',
			groupLabel: '팀 해석',
			icon: '🛒',
			title: '장바구니 탐정단',
			subtitle: '장바구니에서 반복되는 상품 조합을 찾아 비상 대비 코너를 만듭니다.',
			meta: '4인 모둠 · JSON 해석',
			overview: {
				activity: '역할별 장바구니 세 개에서 반복되는 상품 조합을 찾습니다.',
				collaboration: '각자 찾은 계절·상황별 조합을 공유해 진열할 상품을 정합니다.',
				submission: '같이 진열할 상품 조합과 선택 이유',
				flow: ['장바구니 비교', '반복 상품 찾기', '상품 조합 공유', '비상 코너 기획']
			},
			roles: [
				['🧺', '분석가 1', '마스크 관련 장바구니'],
				['🧺', '분석가 2', '선크림 관련 장바구니'],
				['🧺', '분석가 3', '손전등 관련 장바구니'],
				['🧺', '분석가 4', '제설제 관련 장바구니']
			],
			missions: [
				{
					title: '장바구니 JSON 분석',
					studentAction: '세 장바구니를 비교해 반복해서 함께 구입한 상품 두 가지를 찾습니다.',
					share: '역할마다 찾은 상품 조합을 팀원에게 설명합니다.',
					answers: {
						분석가1: ['마스크', '손소독제'],
						분석가2: ['선크림', '생수'],
						분석가3: ['손전등', '건전지'],
						분석가4: ['제설제', '장갑']
					},
					checks: [
						'모든 장바구니에 공통인 상품만 찾는 활동이 아닙니다.',
						'세 개 중 두 개에서 반복되는 조합도 단서가 됩니다.'
					]
				},
				{
					title: '비상 대비 코너 만들기',
					studentAction: '팀원이 찾은 조합 중 함께 진열할 상품과 이유를 정합니다.',
					share: '상품 조합과 관련 계절 또는 상황을 설명합니다.',
					conditions: [
						'비상 대비와 관련된 상품 두 가지를 선택합니다.',
						'두 상품을 함께 진열하면 좋은 이유를 작성합니다.',
						'팀원이 찾은 장바구니 단서를 활용합니다.'
					],
					example: {
						상품조합: ['손전등', '건전지'],
						조합이유: '정전 상황에서 함께 필요하기 때문입니다.',
						이유: '손전등 가까이에 건전지를 두면 필요한 물건을 한 번에 준비할 수 있습니다.'
					},
					checks: [
						'여러 조합이 가능하므로 근거를 중심으로 확인합니다.',
						'상품만 적지 않고 함께 진열할 이유를 설명해야 합니다.'
					]
				}
			]
		},
		{
			id: 'disaster-safety',
			group: 'read',
			groupLabel: '팀 해석',
			icon: '🌧️',
			title: '재난 안전 분석',
			subtitle: '서로 다른 재난 자료에서 위험 단서를 찾고 우선 확인 지역을 결정합니다.',
			meta: '4인 모둠 · 실제 데이터',
			overview: {
				activity: '지역별 침수와 재난 자료를 읽고 중요한 위험 단서를 찾습니다.',
				collaboration: '각자가 본 자료와 중요 단서를 말하고 지역별 위험을 비교합니다.',
				submission: '우선 확인 지역과 자료에 근거한 모둠 의견',
				flow: ['재난 자료 읽기', '위험 단서 찾기', '역할별 의견 공유', '우선 지역 결정']
			},
			roles: [
				['📍', '지역 자료 담당', '지역별 위험도'],
				['🏢', '시설 자료 담당', '위험 시설과 주변 환경'],
				['📋', '사고 자료 담당', '과거 사고와 피해'],
				['🛟', '대응 자료 담당', '안전 대응 방법']
			],
			missions: [
				{
					title: '재난 자료에서 단서 찾기',
					studentAction: '자기 역할의 자료에서 위험 판단에 필요한 단서를 찾습니다.',
					share: '내가 본 자료, 중요 단서, 내 생각을 팀원에게 설명합니다.',
					conditions: [
						'내가 본 자료를 작성합니다.',
						'중요 단서를 한 가지 이상 작성합니다.',
						'자료를 보고 판단한 생각을 작성합니다.'
					],
					checks: [
						'자료에 없는 내용을 근거로 사용하지 않습니다.',
						'핵심 단서를 골라 설명하게 합니다.'
					]
				},
				{
					title: '우선 확인 지역 결정',
					studentAction: '팀원의 단서를 모아 우선 확인할 지역을 정합니다.',
					share: '지역별 침수 위험과 피해 가능성을 비교합니다.',
					example: {
						우선확인지역: ['서초구', '강서구'],
						중요단서: ['침수 위험이 높음', '피해 가능성이 큼'],
						모둠의견: '침수 위험이 높은 지역을 먼저 확인해야 합니다.'
					},
					checks: [
						'한 학생의 자료만으로 결론을 내리지 않습니다.',
						'선택한 지역과 이유가 연결되어야 합니다.'
					]
				}
			]
		},
		{
			id: 'owl-bus',
			group: 'read',
			groupLabel: '팀 해석',
			icon: '🚌',
			title: '올빼미버스 기획단',
			subtitle: '역할별 생활인구 자료를 비교해 심야버스 노선을 기획합니다.',
			meta: '4인 모둠 · 열린 결론형',
			overview: {
				activity: '야간인구, 이동인구, 외부 유입인구 등 지역별 데이터를 비교합니다.',
				collaboration: '역할마다 추천 지역과 근거를 말하고 모둠 노선을 함께 정합니다.',
				submission: '두 곳 이상을 연결한 노선 배열과 노선을 정한 이유',
				flow: ['인구 자료 비교', '후보 지역 추천', '추천 근거 공유', '모둠 노선 결정']
			},
			roles: [
				['🌙', '밤 인구 조사원', '야간인구수'],
				['↔️', '지역 이동 조사원', '자치구간 이동인구수'],
				['🚉', '외부 방문 조사원', '서울 외 유입인구수'],
				['🗺️', '후보 지역 조사원', '후보 지역 종합 자료']
			],
			missions: [
				{
					title: '역할별 인구 자료 비교',
					studentAction: '세 지역의 수치를 비교해 심야버스가 필요한 지역을 추천합니다.',
					share: '추천 지역과 추천 근거를 팀원에게 설명합니다.',
					conditions: [
						'자료에 등장한 지역을 추천합니다.',
						'추천 이유를 자신이 본 수치와 연결합니다.'
					],
					checks: [
						'가장 큰 숫자만 말하지 않고 그 숫자의 의미를 설명하게 합니다.',
						'역할마다 다른 기준을 사용한다는 점을 확인합니다.'
					]
				},
				{
					title: '모둠 노선 결정',
					studentAction: '각자의 추천과 근거를 비교해 최종 노선을 만듭니다.',
					share: '이동량, 야간인구, 외부 유입 등 여러 기준을 함께 사용합니다.',
					conditions: [
						'우리모둠노선은 배열이어야 합니다.',
						'지역을 두 곳 이상 포함해야 합니다.',
						'자료에 나온 지역을 사용해야 합니다.',
						'노선을 정한 이유를 작성해야 합니다.'
					],
					example: {
						우리모둠노선: ['영등포구', '강남구', '송파구'],
						노선을정한이유: '지역 사이 이동이 많고 밤에 머무는 사람이 많은 지역을 연결했습니다.'
					},
					checks: [
						'위 결과는 가능한 예시이며 하나의 정답이 아닙니다.',
						'결과보다 자료에 근거해 노선을 정했는지 확인합니다.'
					]
				}
			]
		}
	];

	let selectedMainStage = 'learning';
	let selectedLearningStep = 0;
	let selectedIndividualId = individualTemplates[0].id;
	let teamFilter = 'write';
	let selectedThemeId = teamThemes.find((theme) => theme.group === 'write')?.id ?? '';
	let selectedMissionIndex = 0;
	let showMissionDetail = true;
	let showAnswer = false;

	$: selectedIndividual =
		individualTemplates.find((template) => template.id === selectedIndividualId) ??
		individualTemplates[0];

	$: filteredThemes = teamThemes.filter((theme) => theme.group === teamFilter);

	$: selectedTheme =
		teamThemes.find((theme) => theme.id === selectedThemeId) ?? filteredThemes[0] ?? teamThemes[0];

	$: selectedMission =
		selectedTheme?.missions?.[selectedMissionIndex] ?? selectedTheme?.missions?.[0];

	function selectMainStage(stage) {
		selectedMainStage = stage;

		document.getElementById(stage)?.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	}

	function selectTeamFilter(filter) {
		teamFilter = filter;

		const firstTheme = teamThemes.find((theme) => theme.group === filter);

		if (firstTheme) {
			selectTheme(firstTheme.id);
		}
	}

	function selectTheme(id) {
		selectedThemeId = id;
		selectedMissionIndex = 0;
		showMissionDetail = true;
		showAnswer = false;
	}

	function selectMission(index) {
		selectedMissionIndex = index;
		showMissionDetail = true;
		showAnswer = false;
	}

	function formatJson(value) {
		return JSON.stringify(value, null, 2);
	}
	let showLearningAnswer = false;
</script>

<svelte:head>
	<title>제이클래스 교사용 매뉴얼</title>
	<meta
		name="description"
		content="학습하기, 개인 작성 미션, 팀 협동 미션 순서와 테마별 활동 흐름 안내"
	/>
</svelte:head>

<div class="min-h-screen bg-[#f5f6f8] font-nanum text-slate-900">
	<header class="sticky top-0 z-50 border-b border-slate-200 bg-white">
		<div class="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-5">
			<a href="/" class="flex items-center gap-3">
				<div
					class="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 font-gmarket text-xl font-bold text-white"
				>
					J
				</div>

				<div>
					<h1 class="font-gmarket text-xl font-bold tracking-[-0.05em] text-slate-950">
						제이클래스 교사용 매뉴얼
					</h1>

					<p class="mt-1 text-sm font-bold text-slate-500">
						학생은 가입 없이 참여하고, 교사는 미션을 생성·관리하는 제이클래스 수업 안내
					</p>
				</div>
			</a>

			<a
				href="/"
				class="hidden h-11 items-center rounded-xl border border-slate-200 bg-white px-5 text-base font-extrabold text-slate-700 hover:bg-slate-50 sm:inline-flex"
			>
				홈으로
			</a>
		</div>
	</header>

	<main class="mx-auto max-w-[1500px] px-5 py-8 sm:py-10">
		<!-- 전체 수업 흐름 -->
		<section class="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
			<div class="border-b border-slate-200 px-6 py-7 sm:px-9">
				<p class="text-sm font-extrabold text-indigo-600">제이클래스 수업 한눈에 보기</p>
				<h2
					class="mt-2 font-gmarket text-3xl font-bold tracking-[-0.06em] text-slate-950 sm:text-4xl"
				>
					배운다 <span class="text-slate-300">→</span> 혼자 해본다
					<span class="text-slate-300">→</span> 함께 해결한다
				</h2>
				<p class="mt-3 text-base font-bold leading-7 text-slate-600 sm:text-lg">
					학생은 가입 없이 바로 학습하거나 4자리 참여 코드를 입력해 미션에 참여합니다. 교사는 가입
					후 미션을 생성하고 학생의 제출 결과를 확인해 피드백합니다.
				</p>
			</div>

			<div class="grid border-b border-slate-200 md:grid-cols-2">
				<div class="border-b border-slate-200 bg-sky-50 px-6 py-5 md:border-b-0 md:border-r">
					<div class="flex items-center gap-3">
						<span class="rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-extrabold text-white"
							>학생</span
						>
						<strong class="text-lg font-extrabold text-slate-950">가입 없이 바로 참여</strong>
					</div>
					<p class="mt-3 text-sm font-bold leading-6 text-slate-700">
						학습하기는 바로 시작하고, 개인·팀 미션은 교사가 알려 준 4자리 코드를 입력해 입장합니다.
					</p>
				</div>

				<div class="bg-rose-50 px-6 py-5">
					<div class="flex items-center gap-3">
						<span class="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-extrabold text-white"
							>교사</span
						>
						<strong class="text-lg font-extrabold text-slate-950">가입 후 미션 생성·피드백</strong>
					</div>
					<p class="mt-3 text-sm font-bold leading-6 text-slate-700">
						개인·팀 미션을 생성해 참여 코드를 안내하고, 제출 현황과 결과를 확인해 피드백합니다.
					</p>
				</div>
			</div>

			<div class="grid gap-0 lg:grid-cols-3">
				<button
					type="button"
					on:click={() => selectMainStage('learning')}
					class={`border-b p-6 text-left transition lg:border-b-0 lg:border-r ${
						selectedMainStage === 'learning'
							? 'border-indigo-200 bg-indigo-50'
							: 'border-slate-200 bg-white hover:bg-slate-50'
					}`}
				>
					<div class="flex items-center gap-3">
						<span
							class="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 font-black text-white"
							>1</span
						>
						<div>
							<p class="text-sm font-extrabold text-indigo-600">배운다</p>
							<div class="flex flex-wrap items-center gap-2">
								<h3 class="text-xl font-extrabold text-slate-950">학습하기</h3>
								<span
									class="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-extrabold text-sky-700"
									>학생 바로 시작</span
								>
							</div>
						</div>
					</div>
					<p class="mt-4 text-sm font-bold leading-6 text-slate-600">
						가입 없이 바로 시작 → 개념 확인 → 예시 보기 → 직접 연습 → 실행·수정
					</p>
				</button>

				<button
					type="button"
					on:click={() => selectMainStage('individual')}
					class={`border-b p-6 text-left transition lg:border-b-0 lg:border-r ${
						selectedMainStage === 'individual'
							? 'border-amber-200 bg-amber-50'
							: 'border-slate-200 bg-white hover:bg-slate-50'
					}`}
				>
					<div class="flex items-center gap-3">
						<span
							class="grid h-10 w-10 place-items-center rounded-xl bg-amber-500 font-black text-white"
							>2</span
						>
						<div>
							<p class="text-sm font-extrabold text-amber-600">혼자 해본다</p>
							<div class="flex flex-wrap items-center gap-2">
								<h3 class="text-xl font-extrabold text-slate-950">개인 작성 미션</h3>
								<span
									class="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-extrabold text-rose-700"
									>교사 미션 생성 필요</span
								>
							</div>
						</div>
					</div>
					<p class="mt-4 text-sm font-bold leading-6 text-slate-600">
						교사 로그인·미션 생성 → 4자리 코드 안내 → 학생 가입 없이 입장 → JSON 작성·제출 → 교사
						피드백
					</p>
				</button>

				<button
					type="button"
					on:click={() => selectMainStage('team')}
					class={`p-6 text-left transition ${
						selectedMainStage === 'team' ? 'bg-emerald-50' : 'bg-white hover:bg-slate-50'
					}`}
				>
					<div class="flex items-center gap-3">
						<span
							class="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 font-black text-white"
							>3</span
						>
						<div>
							<p class="text-sm font-extrabold text-emerald-600">함께 해결한다</p>
							<div class="flex flex-wrap items-center gap-2">
								<h3 class="text-xl font-extrabold text-slate-950">팀 협동 미션</h3>
								<span
									class="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-extrabold text-rose-700"
									>교사 미션 생성 필요</span
								>
							</div>
						</div>
					</div>
					<p class="mt-4 text-sm font-bold leading-6 text-slate-600">
						교사 로그인·테마 미션 생성 → 4자리 코드 안내 → 학생 가입 없이 입장 → 역할별 미션 →
						공유·최종 해결
					</p>
				</button>
			</div>
		</section>

		<!-- 학습하기 -->
		<section
			id="learning"
			class="mt-8 scroll-mt-24 rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8"
		>
			<div
				class="flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between"
			>
				<div>
					<p class="text-sm font-extrabold text-indigo-600">1. 배운다</p>
					<div class="mt-1 flex flex-wrap items-center gap-2">
						<h2 class="text-2xl font-extrabold text-slate-950">학습하기</h2>
						<span class="rounded-full bg-sky-100 px-3 py-1 text-xs font-extrabold text-sky-700"
							>학생 가입 불필요</span
						>
					</div>
				</div>
				<p class="text-sm font-bold text-slate-500">
					10단계를 클릭하면 내용과 정답을 간단히 확인할 수 있습니다.
				</p>
			</div>

			<div class="mt-5 overflow-x-auto pb-2">
				<div class="min-w-[1040px]">
					<div class="grid grid-cols-10 gap-2">
						{#each learningGroups as group}
							<div
								class="relative pb-3 text-center"
								style={`grid-column: ${group.start} / span ${group.span};`}
							>
								<p class="text-sm font-extrabold text-indigo-700">{group.title}</p>
								<div
									class="absolute bottom-0 left-1 right-1 border-b-2 border-x-2 border-indigo-200"
								></div>
							</div>
						{/each}
					</div>

					<div class="mt-3 grid grid-cols-10 gap-2">
						{#each learningSteps as step, index}
							<button
								type="button"
								on:click={() => {
									selectedLearningStep = index;
									showLearningAnswer = false;
								}}
								class={`rounded-xl border px-2 py-3 text-center transition ${
									selectedLearningStep === index
										? 'border-indigo-500 bg-indigo-600 text-white'
										: 'border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300'
								}`}
							>
								<p class="text-xs font-black opacity-70">{step.number}</p>
								<p class="mt-1 text-sm font-extrabold leading-5">{step.label}</p>
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div class="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-4">
				<div class="flex flex-col gap-3 xl:flex-row xl:items-center">
					<div class="shrink-0 xl:w-[210px]">
						<p class="text-xs font-extrabold text-indigo-600">
							{learningSteps[selectedLearningStep].number}단계 · {learningSteps[
								selectedLearningStep
							].label}
						</p>
						<h3 class="mt-1 text-lg font-extrabold text-slate-950">
							{learningSteps[selectedLearningStep].title}
						</h3>
					</div>
					<div class="hidden h-12 border-l border-indigo-200 xl:block"></div>
					<p class="min-w-0 flex-1 text-sm font-bold leading-6 text-slate-700">
						<span class="mr-2 text-indigo-700">내용</span>{learningSteps[selectedLearningStep]
							.content}
					</p>
					<div class="hidden h-12 border-l border-indigo-200 xl:block"></div>
					<p class="min-w-0 flex-1 text-sm font-bold leading-6 text-slate-700">
						<span class="mr-2 text-indigo-700">미션</span>{learningSteps[selectedLearningStep]
							.mission}
					</p>
					<button
						type="button"
						on:click={() => (showLearningAnswer = !showLearningAnswer)}
						class="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white"
					>
						{showLearningAnswer ? '정답 닫기' : '정답 보기'}
					</button>
				</div>
				{#if showLearningAnswer}
					<pre
						class="mt-4 max-h-56 overflow-auto rounded-xl bg-slate-900 p-4 text-sm leading-6 text-slate-100">{learningSteps[
							selectedLearningStep
						].answer}</pre>
				{/if}
			</div>
		</section>

		<!-- 개인 작성 미션 -->
		<section
			id="individual"
			class="mt-8 scroll-mt-24 rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8"
		>
			<div class="border-b border-slate-200 pb-5">
				<p class="text-sm font-extrabold text-amber-600">2. 혼자 해본다</p>
				<div class="mt-1 flex flex-wrap items-center gap-2">
					<h2 class="text-2xl font-extrabold text-slate-950">개인 작성 미션</h2>
					<span class="rounded-full bg-rose-100 px-3 py-1 text-xs font-extrabold text-rose-700"
						>교사 가입·미션 생성 필요</span
					>
				</div>
				<p class="mt-2 text-sm font-bold leading-6 text-slate-600">
					교사가 로그인해 미션 방을 만들고 4자리 코드를 안내합니다. 학생은 가입 없이 코드를 입력해
					입장하고, 혼자 JSON을 작성·제출합니다.
				</p>
			</div>

			<div class="mt-5 flex flex-wrap items-center gap-2 rounded-2xl bg-amber-50 p-4">
				{#each ['교사 로그인', '미션 선택·생성', '4자리 코드 안내', '학생 가입 없이 입장', 'JSON 작성·수정', '제출', '교사 피드백'] as item, index}
					<span
						class={`rounded-lg px-3 py-2 text-sm font-extrabold ${
							index === 6
								? 'bg-amber-500 text-white'
								: 'border border-amber-200 bg-white text-slate-700'
						}`}
					>
						{item}
					</span>
					{#if index < 6}<span class="font-black text-amber-300">→</span>{/if}
				{/each}
			</div>

			<div class="mt-5 flex gap-2 overflow-x-auto pb-2">
				{#each individualTemplates as template}
					<button
						type="button"
						on:click={() => (selectedIndividualId = template.id)}
						class={`shrink-0 rounded-xl border px-4 py-3 text-left transition ${
							selectedIndividualId === template.id
								? 'border-amber-500 bg-amber-50'
								: 'border-slate-200 bg-slate-50 hover:border-amber-300'
						}`}
					>
						<p class="text-xs font-extrabold text-amber-700">{template.label}</p>
						<p class="mt-1 max-w-[230px] text-sm font-extrabold text-slate-950">{template.title}</p>
					</button>
				{/each}
			</div>

			<div
				class="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:grid-cols-[1fr_420px]"
			>
				<div>
					<div class="flex flex-wrap items-center gap-2">
						<span class="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-extrabold text-amber-800"
							>{selectedIndividual.label}</span
						>
						{#each selectedIndividual.grammar as grammar}
							<span
								class="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-600"
								>{grammar}</span
							>
						{/each}
					</div>
					<h3 class="mt-3 text-xl font-extrabold text-slate-950">{selectedIndividual.title}</h3>
					<p class="mt-2 text-sm font-bold leading-6 text-slate-600">
						{selectedIndividual.summary}
					</p>
					<div class="mt-4 flex flex-wrap items-center gap-2">
						{#each selectedIndividual.flow as flow, index}
							<span class="rounded-lg bg-white px-3 py-2 text-xs font-extrabold text-slate-700"
								>{flow}</span
							>
							{#if index < selectedIndividual.flow.length - 1}<span class="text-slate-300">→</span
								>{/if}
						{/each}
					</div>
				</div>
				<pre
					class="max-h-60 overflow-auto rounded-xl bg-slate-900 p-4 text-sm leading-6 text-slate-100">{formatJson(
						selectedIndividual.example
					)}</pre>
			</div>
		</section>

		<!-- 팀 협동 미션 -->
		<section
			id="team"
			class="mt-8 scroll-mt-24 rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8"
		>
			<div class="border-b border-slate-200 pb-5">
				<p class="text-sm font-extrabold text-emerald-600">3. 함께 해결한다</p>
				<div class="mt-1 flex flex-wrap items-center gap-2">
					<h2 class="text-2xl font-extrabold text-slate-950">
						팀 협동 미션 (로컬테스트에서 사전에 실행해볼 수 있음!) 3~4인
					</h2>
					<span class="rounded-full bg-rose-100 px-3 py-1 text-xs font-extrabold text-rose-700"
						>교사 가입·미션 생성 필요</span
					>
				</div>
				<p class="mt-2 text-sm font-bold leading-6 text-slate-600">
					교사가 로그인해 테마 미션 방을 만들고 4자리 코드를 안내합니다. 학생은 가입 없이 입장해
					역할별 미션을 해결하고 정보를 공유합니다. 팀은 3명 혹은 4명으로 구성합니다.
				</p>
			</div>

			<div class="mt-5 flex flex-wrap items-center gap-2 rounded-2xl bg-emerald-50 p-4">
				{#each ['교사 로그인', '테마 선택·미션 생성', '4자리 코드 안내', '학생 가입 없이 입장', '역할 배정', '미션 제출', '정보 공유', '최종 해결'] as item, index}
					<span
						class={`rounded-lg px-3 py-2 text-sm font-extrabold ${
							index === 7
								? 'bg-emerald-600 text-white'
								: 'border border-emerald-200 bg-white text-slate-700'
						}`}
					>
						{item}
					</span>
					{#if index < 7}<span class="font-black text-emerald-300">→</span>{/if}
				{/each}
			</div>

			<div class="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
				<p class="text-base font-extrabold text-slate-900">
					팀 협동 미션은 작성 미션과 해석 미션, 두 가지로 나뉩니다.
				</p>
				<p class="mt-1 text-sm font-bold leading-6 text-slate-600">
					아래에서 진행할 미션 유형을 선택하세요.
				</p>

				<div class="mt-4 grid gap-3 sm:grid-cols-2">
					<button
						type="button"
						on:click={() => selectTeamFilter('write')}
						class={`rounded-2xl border p-4 text-left transition ${
							teamFilter === 'write'
								? 'border-violet-500 bg-violet-50 ring-2 ring-violet-100'
								: 'border-violet-200 bg-white hover:border-violet-400 hover:bg-violet-50/50'
						}`}
					>
						<div class="flex items-start justify-between gap-3">
							<div>
								<p class="font-extrabold text-violet-700">작성 미션</p>
								<p class="mt-2 text-sm font-bold leading-6 text-slate-600">
									팀원마다 서로 다른 역할과 값을 맡아 JSON을 작성합니다. 각자 작성한 내용을 공유하고
									하나로 합쳐 최종 JSON을 완성합니다.
								</p>
							</div>

							<span
								class={`shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold ${
									teamFilter === 'write'
										? 'bg-violet-600 text-white'
										: 'bg-violet-100 text-violet-700'
								}`}
							>
								{teamFilter === 'write' ? '선택됨' : '선택'}
							</span>
						</div>
					</button>

					<button
						type="button"
						on:click={() => selectTeamFilter('read')}
						class={`rounded-2xl border p-4 text-left transition ${
							teamFilter === 'read'
								? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100'
								: 'border-emerald-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/50'
						}`}
					>
						<div class="flex items-start justify-between gap-3">
							<div>
								<p class="font-extrabold text-emerald-700">해석 미션</p>
								<p class="mt-2 text-sm font-bold leading-6 text-slate-600">
									팀원마다 서로 다른 자료를 읽고 필요한 단서를 찾습니다. 찾은 정보를 공유하고
									토의하여 팀의 최종 결론을 완성합니다.
								</p>
							</div>

							<span
								class={`shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold ${
									teamFilter === 'read'
										? 'bg-emerald-600 text-white'
										: 'bg-emerald-100 text-emerald-700'
								}`}
							>
								{teamFilter === 'read' ? '선택됨' : '선택'}
							</span>
						</div>
					</button>
				</div>
			</div>

			<div class="mt-5 flex gap-2 overflow-x-auto pb-2">
				{#each filteredThemes as theme}
					<button
						type="button"
						on:click={() => selectTheme(theme.id)}
						class={`shrink-0 rounded-xl border px-4 py-3 text-left transition ${
							selectedTheme.id === theme.id
								? teamFilter === 'write'
									? 'border-violet-500 bg-violet-50'
									: 'border-emerald-500 bg-emerald-50'
								: 'border-slate-200 bg-slate-50 hover:border-slate-400'
						}`}
					>
						<p class="text-xl">{theme.icon}</p>
						<p class="mt-1 max-w-[180px] text-sm font-extrabold text-slate-950">{theme.title}</p>
					</button>
				{/each}
			</div>

			<div class="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
				<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p
							class={`text-xs font-extrabold ${
								selectedTheme.group === 'write' ? 'text-violet-700' : 'text-emerald-700'
							}`}
						>
							{selectedTheme.groupLabel} · {selectedTheme.meta}
						</p>
						<h3 class="mt-1 text-xl font-extrabold text-slate-950">
							{selectedTheme.icon}
							{selectedTheme.title}
						</h3>
						<p class="mt-1 text-sm font-bold text-slate-600">{selectedTheme.subtitle}</p>
					</div>
				</div>

				<div class="mt-4 grid gap-2 lg:grid-cols-3">
					{#each selectedTheme.missions as mission, index}
						<button
							type="button"
							on:click={() => selectMission(index)}
							class={`rounded-xl border p-4 text-left transition ${
								selectedMissionIndex === index
									? 'border-slate-500 bg-white ring-2 ring-slate-200'
									: 'border-slate-200 bg-white hover:border-slate-400'
							}`}
						>
							<p class="text-xs font-extrabold text-slate-400">미션 {index + 1}</p>
							<h4 class="mt-1 text-base font-extrabold text-slate-950">{mission.title}</h4>
							<p class="mt-2 text-sm font-bold leading-6 text-slate-600">{mission.studentAction}</p>
						</button>
					{/each}
				</div>

				{#if selectedMission}
					<div
						class="mt-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-start"
					>
						<div class="min-w-0 flex-1">
							<p class="text-xs font-extrabold text-slate-400">선택한 미션</p>
							<h4 class="mt-1 text-lg font-extrabold text-slate-950">{selectedMission.title}</h4>
							<p class="mt-2 text-sm font-bold leading-6 text-slate-700">
								{selectedMission.studentAction}
							</p>
							{#if selectedMission.share}
								<p class="mt-2 text-sm font-bold leading-6 text-emerald-700">
									협력: {selectedMission.share}
								</p>
							{/if}
						</div>
						<button
							type="button"
							on:click={() => (showAnswer = !showAnswer)}
							class="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white"
						>
							{showAnswer ? '정답 닫기' : '정답 보기'}
						</button>
					</div>
					{#if showAnswer}
						<pre
							class="mt-3 max-h-72 overflow-auto rounded-xl bg-slate-900 p-4 text-sm leading-6 text-slate-100">{formatJson(
								selectedMission.answers ??
									selectedMission.example ??
									selectedMission.conditions ??
									{}
							)}</pre>
					{/if}
				{/if}
			</div>
		</section>
	</main>
</div>
