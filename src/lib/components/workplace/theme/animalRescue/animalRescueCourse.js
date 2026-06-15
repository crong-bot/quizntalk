// src/lib/components/workplace/theme/animalRescue/animalRescueCourse.js

export const animalRescueCourse = {
	id: 'animalRescue',
	title: '동물구조대: 늑구 추적 작전',
	subtitle: '각자 JSON 단서를 해석하고, 팀 단서를 모아 늑구가 숨어 있는 곳을 찾아보세요!',
	icon: '🐾',
	themeId: 'animalRescue',
	categoryId: 'read',
	categoryTitle: '제이슨 해석',
	mode: 'read',

	intro: {
		badge: 'RESCUE BRIEFING',
		title: '늑구 추적 작전 시작',
		subtitle: '흩어진 JSON 단서를 모아 늑구가 숨어 있는 곳을 찾아야 합니다.',
		image: '/images/themes/animal/intro.png',
		imageAlt: '동물 구조대가 단서를 분석하는 장면',
		summaryTitle: '현재 상황',
		summary:
			'길을 잃은 늑구가 학교 주변에서 목격되었습니다. 하지만 늑구가 어디에 숨어 있는지는 아직 알 수 없습니다. 각 대원은 서로 다른 JSON 단서를 가지고 있습니다.',
		goalTitle: '우리의 임무',
		missionGoal:
			'미션 1에서는 각자 맡은 JSON에서 팀원에게 알려 줄 중요한 단서를 찾아 제출합니다. 미션 2에서는 팀원들의 단서를 모아 후보 장소와 비교하고, 늑구가 숨어 있는 곳을 추리합니다.',
		steps: [
			'가운데 JSON 조각 단서를 읽습니다.',
			'여러 자료를 비교하고 확인합니다.',
			'미션1에서는 팀원에게 알려 줄 중요한 단서를 제출합니다.',
			'미션2에서는 팀 단서와 후보 장소를 비교해 늑구가 있는 곳을 정합니다.'
		],
		tip: '힌트: 미션 1에서는 장소를 바로 맞히는 것이 아니라, 팀원에게 알려 줄 단서를 찾는 것이 중요합니다.',
		buttonText: '추적 작전 시작하기'
	},

	completion: {
		icon: '🐾',
		badge: '최종 구조 보고서',
		title: '늑구 추적 작전 성공!',
		description: '모둠원이 JSON 단서를 모아 늑구가 숨어 있는 곳을 찾아냈습니다.',
		resultTitle: '늑구 발견 위치',
		result: '하천 옆 수로',
		reasons: [
			'믿을 만한 제보에서 늑구가 물소리 나는 쪽으로 이동했다는 단서를 찾음',
			'확실한 흔적에서 젖은 발자국이 물이 있는 길을 따라 이어졌다는 단서를 찾음',
			'행동 기록에서 늑구가 어둡고 조용한 곳에 숨기 쉽다는 단서를 찾음',
			'안전 조건에서 사람이 적은 곳이 구조하기 좋다는 단서를 찾음'
		],
		message: '팀의 JSON 단서 분석으로 늑구가 숨어 있는 곳을 찾았습니다!',
		exitButtonText: '완료하기'
	},

	roles: [
		{
			id: 'report',
			name: '민서',
			roleName: '제보 분석 대원',
			avatarSrc: '/images/avatars/1.png'
		},
		{
			id: 'trace',
			name: '준호',
			roleName: '흔적 분석 대원',
			avatarSrc: '/images/avatars/2.png'
		},
		{
			id: 'behavior',
			name: '서연',
			roleName: '행동 분석 대원',
			avatarSrc: '/images/avatars/3.png'
		},
		{
			id: 'safety',
			name: '도윤',
			roleName: '안전 분석 대원',
			avatarSrc: '/images/avatars/4.png'
		}
	],

	missions: [
		{
			id: 'clue-extract',
			title: '역할별 JSON 단서 찾기',
			type: 'role-analysis',
			question: '내 JSON을 읽고 팀원에게 알려 줄 중요한 단서를 찾아보세요.',
			initialJson: `{}`,

			roleMissions: {
				report: {
					story: {
						title: '제보 JSON 해석',
						call: '제보 분석 대원님, 목격 제보를 확인해 주세요.',
						summary: '두 제보의 시각, 신뢰도, 내용을 함께 비교해 팀원에게 알려 줄 제보를 찾습니다.',
						mission: '어떤 제보를 팀원에게 알려야 할지 고르고, 그 이유를 제출하세요.'
					},
					role: {
						title: '제보 분석 대원',
						icon: '📢',
						description: '제보의 시각과 신뢰도를 비교해 팀에 알릴 단서를 찾는 역할'
					},
					answerFields: [
						{
							key: '제보',
							label: '어떤 제보를 팀원에게 알려야 할까요?'
						},
						{
							key: '이유',
							label: '그 제보를 고른 이유는 무엇인가요?'
						}
					],
					clues: [
						{
							type: 'json',
							title: '목격 제보 JSON',
							data: {
								목격제보: [
									{
										시각: '14:10',
										내용: '회색 동물이 운동장 쪽으로 뛰어간 것 같아요.',
										신뢰도: '낮음'
									},
									{
										시각: '14:45',
										내용: '파란 목줄을 한 회색 늑구가 물소리 나는 쪽으로 걸어갔어요.',
										신뢰도: '높음'
									}
								],
								찾을것: '시각, 신뢰도, 내용을 함께 보고 팀원에게 알려 줄 제보를 고르기'
							}
						}
					],
					keyChips: []
				},

				trace: {
					story: {
						title: '흔적 JSON 해석',
						call: '흔적 분석 대원님, 현장 흔적을 확인해 주세요.',
						summary:
							'두 흔적의 상태, 설명, 이어진 방향을 함께 비교해 팀원에게 알려 줄 흔적을 찾습니다.',
						mission: '어떤 흔적을 팀원에게 알려야 할지 고르고, 그 이유를 제출하세요.'
					},
					role: {
						title: '흔적 분석 대원',
						icon: '🐾',
						description: '흔적의 상태와 설명을 비교해 팀에 알릴 단서를 찾는 역할'
					},
					answerFields: [
						{
							key: '흔적',
							label: '어떤 흔적을 팀원에게 알려야 할까요?'
						},
						{
							key: '이유',
							label: '그 흔적을 고른 이유는 무엇인가요?'
						}
					],
					clues: [
						{
							type: 'json',
							title: '현장 흔적 JSON',
							data: {
								흔적기록: [
									{
										흔적: '마른 흙 발자국',
										상태: '흐릿함',
										설명: '넓은 흙길 근처에서 조금 보임',
										이어진방향: '알기 어려움'
									},
									{
										흔적: '젖은 발자국',
										상태: '선명함',
										설명: '물이 있는 길을 따라 이어짐',
										이어진방향: '물소리 나는 쪽'
									}
								],
								찾을것: '상태, 설명, 이어진방향을 함께 보고 팀원에게 알려 줄 흔적 고르기'
							}
						}
					],
					keyChips: []
				},

				behavior: {
					story: {
						title: '행동 JSON 해석',
						call: '행동 분석 대원님, 늑구의 행동 기록을 확인해 주세요.',
						summary:
							'두 환경에서 늑구의 반응과 상태를 비교해 늑구가 숨기 쉬운 곳의 특징을 찾습니다.',
						mission: '늑구가 어떤 곳에 숨기 쉬울지 생각하고, 그 이유를 제출하세요.'
					},
					role: {
						title: '행동 분석 대원',
						icon: '🧠',
						description: '환경에 따른 늑구의 반응과 상태를 비교하는 역할'
					},
					answerFields: [
						{
							key: '행동',
							label: '늑구는 어떤 곳에 숨기 쉬울까요?'
						},
						{
							key: '이유',
							label: '그렇게 생각한 이유는 무엇인가요?'
						}
					],
					clues: [
						{
							type: 'json',
							title: '늑구 행동 JSON',
							data: {
								행동기록: [
									{
										환경: '밝고 큰 소리가 나는 곳',
										반응: '놀라서 도망가려 함',
										상태: '불안'
									},
									{
										환경: '어둡고 조용한 곳',
										반응: '움직임을 줄이고 숨어 있으려 함',
										상태: '안정'
									}
								],
								찾을것: '환경, 반응, 상태를 함께 보고 늑구가 숨기 쉬운 곳의 특징 찾기'
							}
						}
					],
					keyChips: []
				},

				safety: {
					story: {
						title: '안전 JSON 해석',
						call: '안전 분석 대원님, 구조 조건을 확인해 주세요.',
						summary: '두 조건의 안전도와 이유를 비교해 구조대가 접근하기 좋은 조건을 찾습니다.',
						mission: '어떤 조건이 구조하기 좋은지 고르고, 그 이유를 제출하세요.'
					},
					role: {
						title: '안전 분석 대원',
						icon: '🛟',
						description: '구조할 때 안전한 조건과 위험한 조건을 비교하는 역할'
					},
					answerFields: [
						{
							key: '안전조건',
							label: '어떤 조건이 구조하기 좋을까요?'
						},
						{
							key: '이유',
							label: '그 이유는 무엇인가요?'
						}
					],
					clues: [
						{
							type: 'json',
							title: '구조 안전 JSON',
							data: {
								구조조건: [
									{
										조건: '사람이 많은 곳',
										안전도: '낮음',
										이유: '늑구가 놀라거나 사람들이 다칠 수 있음'
									},
									{
										조건: '사람이 적은 곳',
										안전도: '높음',
										이유: '구조대가 조용히 접근하기 좋음'
									}
								],
								찾을것: '조건, 안전도, 이유를 함께 보고 구조하기 좋은 조건 고르기'
							}
						}
					],
					keyChips: []
				}
			}
		},

		{
			id: 'final-trace',
			title: '팀 단서로 늑구 위치 정하기',
			type: 'role-analysis',
			question: '팀원들이 찾은 단서와 후보 장소를 비교해 늑구가 숨어 있을 곳을 정하세요.',
			answerFields: [
				{
					key: '늑구가있는곳',
					label: '늑구가 숨어 있을 곳은 어디인가요?'
				},
				{
					key: '그렇게생각한이유',
					label: '그렇게 생각한 이유는 무엇인가요?',
					multiline: true
				}
			],
			initialJson: `{
  "늑구가있는곳": "",
  "그렇게생각한이유": ""
}`,

			sourceMissionId: 'clue-extract',
			sourceAnswerTitle: '팀이 찾은 단서',

			roleMissions: {
				report: createFinalTraceRoleMission('팀원들의 단서를 모아 늑구가 숨어 있을 곳을 정하세요.'),
				trace: createFinalTraceRoleMission('팀원들의 단서를 모아 늑구가 숨어 있을 곳을 정하세요.'),
				behavior: createFinalTraceRoleMission(
					'팀원들의 단서를 모아 늑구가 숨어 있을 곳을 정하세요.'
				),
				safety: createFinalTraceRoleMission('팀원들의 단서를 모아 늑구가 숨어 있을 곳을 정하세요.')
			}
		}
	]
};

function createFinalTraceRoleMission(call) {
	return {
		story: {
			title: '팀 단서 토론',
			call,
			summary: '각자 찾은 단서를 말하고, 후보 장소 중 가장 알맞은 곳을 함께 고릅니다.',
			mission: '팀 단서와 가장 많이 맞는 장소를 고르고 이유를 작성하세요.'
		},
		role: {
			title: '팀 단서 토론',
			icon: '🧩',
			description: '팀 단서를 모아 늑구의 위치를 정하는 역할'
		},
		clues: [
			{
				type: 'json',
				title: '후보 장소 JSON',
				data: {
					후보장소: [
						{
							장소: '운동장',
							특징: ['밝음', '사람 많음']
						},
						{
							장소: '하천 옆 수로',
							특징: ['물소리', '젖은 길', '어두움', '조용함', '사람 적음']
						},
						{
							장소: '체육관 뒤편',
							특징: ['어두움', '조용함', '사람 적음', '마른 바닥']
						}
					],
					할일: '팀 단서와 가장 많이 맞는 장소를 고르세요.'
				}
			}
		],
		keyChips: []
	};
}
