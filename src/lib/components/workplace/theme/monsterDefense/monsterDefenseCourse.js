// src/lib/components/workplace/theme/monsterDefense/monsterDefenseCourse.js

import {
	monsterDefenseMissionSuccessStates,
	monsterDefenseRoleSuccessStates
} from './monsterDefenseLayers.js';

const mission1wallStructureHint = {
	type: 'structure',
	title: '미션1 JSON 구조도',
	rootLabel: '단서수집',

	items: [
		{
			label: '위험방향',
			valueType: '문자',
			description: '북쪽?동쪽?어느방향인지'
		},
		{
			label: '이유',
			valueType: '문자',
			description: '그렇게 생각한 이유'
		}
	]
};
const mission1trapStructureHint = {
	type: 'structure',
	title: '미션1 JSON 구조도',
	rootLabel: '단서수집',
	items: [
		{
			label: '추천트랩',
			valueType: '문자',
			description: '트랩의 종류'
		},
		{
			label: '이유',
			valueType: '문자',
			description: '그렇게 생각한 이유'
		}
	]
};
const mission1cannonStructureHint = {
	type: 'structure',
	title: '미션1 JSON 구조도',
	rootLabel: '단서수집',
	items: [
		{
			label: '추천대포',
			valueType: '문자',
			description: '어떤 대포가 효과적?'
		},
		{
			label: '이유',
			valueType: '문자',
			description: '그렇게 생각한 이유'
		}
	]
};
const mission1scoutStructureHint = {
	type: 'structure',
	title: '미션1 JSON 구조도',
	rootLabel: '단서수집',
	items: [
		{
			label: '괴물이름',
			valueType: '문자',
			description: '무슨 괴물?'
		},
		{
			label: '침입방향',
			valueType: '문자',
			description: '어디로 침입?'
		}
	]
};
const mission2wallStructureHint = {
	type: 'structure',
	title: '미션1 JSON 구조도',
	rootLabel: '방어도구',
	items: [
		{
			label: '성벽',
			children: [
				{ label: '재료', description: '필요한 재료' },
				{ label: '높이', description: '몇 m ?' },
				{ label: '문상태', description: '열림?닫힘?' }
			]
		}
	]
};
const mission2trapStructureHint = {
	type: 'structure',
	title: '미션1 JSON 구조도',
	rootLabel: '방어도구',
	items: [
		{
			label: '트랩',
			children: [
				{ label: '종류', description: '트랩의 종류' },
				{ label: '재료', description: '필요한 재료' },
				{ label: '작동방식', description: '밀기?당기기?' }
			]
		}
	]
};
const mission2cannonStructureHint = {
	type: 'structure',
	title: '미션1 JSON 구조도',
	rootLabel: '방어도구',
	items: [
		{
			label: '대포',
			children: [
				{ label: '종류', description: '대포의 종류' },
				{ label: '재료', description: '필요한 재료' },
				{ label: '발사세기', description: '숫자' }
			]
		}
	]
};
const mission2scoutStructureHint = {
	type: 'structure',
	title: '미션1 JSON 구조도',
	rootLabel: '방어도구',
	items: [
		{
			label: '정찰장비',
			children: [
				{ label: '장비', description: '장비의 종류' },
				{ label: '보고대상', description: '어떤팀에게 보고?' },
				{ label: '경보단계', description: '숫자' }
			]
		}
	]
};

const finalDefenseStructureHint = {
	type: 'structure',
	title: '최종방어작전 JSON 구조도',
	rootLabel: '최종방어작전',
	items: [
		{
			label: '목표',
			children: [
				{ label: '괴물', description: '어떤 괴물인가?' },
				{ label: '방향', description: '어느 방향에서 오는가?' }
			]
		},
		{
			label: '방어도구',
			valueType: '배열',
			description: '사용할 방어도구를 [ ] 배열로 정리'
		},
		{
			label: '실행',
			valueType: 'bool',
			description: 'true / false'
		}
	]
};

const finalDefensePlan = {
	목표: {
		괴물: '초록괴물',
		방향: '북쪽'
	},
	방어도구: ['성벽', '그물트랩', '불대포'],
	실행: true
};

export const monsterDefenseCourse = {
	id: 'monster-defense',
	title: '괴물 도시 방어 작전',
	subtitle: '정찰하고, 방어 도구를 만들고, 최종 방어 계획으로 도시를 지켜요.',
	icon: '🛡️',
	themeId: 'monsterDefense',
	difficulty: '전설',
	completion: {
		learningResults: [
			{
				label: '객체 object',
				value: '{ }',
				description: '성벽, 트랩, 대포 정보를 묶음'
			},
			{
				label: '중첩 구조',
				value: '성벽.방향',
				description: '객체 안에 객체를 넣어 정리'
			},
			{
				label: '불리언 boolean',
				value: 'true',
				description: '문닫기, 작동 상태 표현'
			}
		]
	},
	intro: {
		badge: 'CITY DEFENSE',
		title: '괴물 도시 방어 작전',
		subtitle: 'JSON으로 정찰 기록과 방어 계획을 만들고, 최종 작전을 실행하세요.',
		image: '/images/themes/monster-defense/intro.png',
		imageAlt: '도시를 향해 다가오는 초록괴물과 방어 장치',
		summaryTitle: '현재 상황',
		shortSummary:
			'우리 마을에 몬스터가 쳐들어온다는 정보가 들어왔습니다. 사전 정보를 조사하고, 방어 도구를 만들어 몬스터로부터 마을을 지켜 보세요!',
		summary:
			'우리 마을에 몬스터가 쳐들어온다는 정보가 들어왔습니다. 정보를 수집하고 방어도구를 만들어 몬스터로부터 마을을 지켜 보세요!',
		goalTitle: '우리의 임무',
		missionGoal:
			'미션 1과 2에서는 각자 판단한 값을 JSON으로 입력합니다. 마지막 미션에서 팀의 최종 방어 계획을 입력하면 공용화면에서 실제 방어 결과가 실행됩니다.',
		steps: [
			'미션 1에서 정찰 정보를 JSON으로 정리합니다.',
			'미션 2에서 방어 도구 정보를 JSON으로 만듭니다.',
			'미션 1과 2는 정답을 맞히는 단계가 아니라, JSON 구조를 확인하는 단계입니다.',
			'미션 3에서 최종 방어 계획을 입력합니다.',
			'최종 계획이 맞으면 괴물을 막고, 틀리면 방어에 실패합니다.'
		],
		tip: '힌트: 문자열은 "따옴표"로 감싸고, true/false는 따옴표 없이 입력해요.',
		buttonText: '방어 작전 시작하기'
	},

	roles: [
		{
			id: 'wall',
			name: '준호',
			roleName: '성벽팀',
			avatarSrc: '/images/avatars/2.png'
		},

		{
			id: 'trap',
			name: '서연',
			roleName: '트랩팀',
			avatarSrc: '/images/avatars/3.png'
		},
		{
			id: 'attack',
			name: '도윤',
			roleName: '대포팀',
			avatarSrc: '/images/avatars/4.png'
		},
		{
			id: 'scout',
			name: '민서',
			roleName: '정찰팀',
			avatarSrc: '/images/avatars/1.png'
		}
	],

	// completion: {
	// 	badge: 'DEFENSE COMPLETE',
	// 	title: '도시 방어 작전 완료!',
	// 	subtitle: '최종 방어 계획이 실행되었습니다.',
	// 	summaryTitle: '최종 결과',
	// 	summary: '공용화면에서 괴물 침입과 방어 결과를 확인하세요.',
	// 	primaryButtonText: '홈으로'
	// },

	missions: [
		{
			id: 'scout',
			layerKey: 'scout',
			title: '방어 단서 수집하기',
			type: 'individual',
			effectKey: 'scout',
			roleSuccessState: monsterDefenseRoleSuccessStates,
			successState: monsterDefenseMissionSuccessStates.scout,
			simulationScope: 'none',

			roleMissions: {
				wall: {
					story: {
						call: '성벽팀, 성벽 주변의 위험 단서를 확인하세요.',
						summary: '성벽 주변 기록을 보고 어느 방향이 위험한지 찾아 JSON으로 정리합니다.',
						mission: '성벽 단서를 보고 위험방향과 핵심단서를 입력하세요.'
					},
					role: {
						title: '성벽팀',
						icon: '🧱',
						description: '성벽 주변 흔적을 보고 위험 방향을 판단하는 역할'
					},
					clues: [
						mission1wallStructureHint,
						'북쪽 입구 근처에는 큰 발자국이 있습니다.',
						'동쪽 입구 근처에는 작은 발자국이 흩어져 있습니다.',
						'남쪽 입구는 굳게 닫혀 있어 지나간 흔적이 없습니다.',
						'서쪽에는 오래된 긁힌 자국만 남아 있습니다.'
					],
					keyChips: ['단서수집', '위험방향', '핵심단서'],
					valueChips: [
						'"북쪽"',
						'"동쪽"',
						'"남쪽"',
						'"서쪽"',
						'"큰발자국"',
						'"작은발자국"',
						'"긁힌자국"'
					],
					initialJson: `{
  "단서수집": {
    "위험방향": "",
    "이유": ""
  }
}`
				},

				trap: {
					story: {
						call: '트랩팀, 트랩 실험 단서를 확인하세요.',
						summary: '트랩 실험 결과를 보고 어떤 트랩이 가장 효과적인지 JSON으로 정리합니다.',
						mission: '트랩 실험 단서를 보고 추천트랩과 핵심단서를 입력하세요.'
					},
					role: {
						title: '트랩팀',
						icon: '🕸️',
						description: '괴물을 멈출 트랩을 판단하는 역할'
					},
					clues: [
						mission1trapStructureHint,
						'그물트랩은 초록괴물을 오래 멈추게 했습니다.',
						'미끄럼기름은 처음에는 효과가 있었지만 금방 풀렸습니다.',
						'소리폭탄은 거의 효과가 없었습니다.'
					],
					keyChips: ['단서수집', '추천트랩', '핵심단서'],
					valueChips: [
						'"그물트랩"',
						'"미끄럼기름"',
						'"소리폭탄"',
						'"오래멈춤"',
						'"금방풀림"',
						'"효과없음"'
					],
					initialJson: `{
  "단서수집": {
    "추천트랩": "",
    "이유": ""
  }
}`
				},

				attack: {
					story: {
						call: '대포팀, 대포 실험 단서를 확인하세요.',
						summary: '대포 실험 결과를 보고 어떤 대포가 가장 효과적인지 JSON으로 정리합니다.',
						mission: '대포 실험 단서를 보고 추천대포와 핵심단서를 입력하세요.'
					},
					role: {
						title: '대포팀',
						icon: '💧',
						description: '괴물을 약하게 만들 대포를 판단하는 역할'
					},
					clues: [
						mission1cannonStructureHint,
						'불대포를 맞은 초록괴물은 크게 약해졌습니다.',
						'물대포는 거의 효과가 없었습니다.',
						'바람대포는 조금 밀어냈지만 금방 다시 움직였습니다.'
					],
					keyChips: ['단서수집', '추천대포', '핵심단서'],
					valueChips: [
						'"물대포"',
						'"불대포"',
						'"바람대포"',
						'"크게약해짐"',
						'"효과없음"',
						'"금방움직임"'
					],
					initialJson: `{
  "단서수집": {
    "추천대포": "",
    "이유": ""
  }
}`
				},

				scout: {
					story: {
						call: '정찰팀, 괴물 정체 단서를 확인하세요.',
						summary: '비슷한 괴물 기록을 비교해 어떤 괴물이 오는지 JSON으로 정리합니다.',
						mission: '정찰 단서를 보고 괴물이름, 침입방향을 입력하세요.'
					},
					role: {
						title: '정찰팀',
						icon: '🔭',
						description: '괴물의 정체와 침입 방향을 추측하는 역할'
					},
					clues: [
						mission1scoutStructureHint,
						'정찰 기록에는 초록색 괴물이 보였다고 적혀 있습니다.',
						'초록괴물은 크기가 크고 도시 쪽으로 걸어옵니다.',
						'숲괴물도 초록색이지만 크기가 작고 숲에서 잘 나오지 않습니다.',
						'경보는 북쪽 감시탑에서 가장 먼저 울렸습니다.'
					],
					keyChips: ['단서수집', '괴물이름', '침입방향'],
					valueChips: ['"초록괴물"', '"숲괴물"', '"북쪽"', '"동쪽"'],
					initialJson: `{
  "단서수집": {
    "괴물이름": "",
    "침입방향": ""
  }
}`
				}
			}
		},

		{
			id: 'prepare-tools',
			layerKey: 'prepareTools',
			title: '방어 도구 만들기',
			type: 'individual',
			effectKey: 'prepareTools',
			roleSuccessState: monsterDefenseRoleSuccessStates,
			successState: monsterDefenseMissionSuccessStates.prepare,
			simulationScope: 'none',

			roleMissions: {
				wall: {
					story: {
						call: '성벽팀, 성벽 설계도 JSON을 만드세요.',
						summary: '성벽을 튼튼하게 만들 재료와 상태를 JSON으로 정리합니다.',
						mission: '성벽 제작 단서를 보고 재료, 높이, 문상태를 입력하세요.'
					},
					role: {
						title: '성벽팀',
						icon: '🧱',
						description: '성벽을 튼튼하게 준비하는 역할'
					},
					clues: [
						mission2wallStructureHint,
						'성벽을 만들려면 돌, 철문, 잠금장치가 필요합니다.',
						'초록괴물을 막기 위해 성벽 높이는 5로 정합니다.',
						'괴물이 들어오지 못하게 문상태는 닫힘으로 정합니다.'
					],
					keyChips: ['방어도구', '성벽', '재료', '높이', '문상태'],
					valueChips: ['"돌"', '"철문"', '"잠금장치"', '5', '"닫힘"'],
					initialJson: `{
  "방어도구": {
    "성벽": {
      "재료": [],
      "높이": 0,
      "문상태": ""
    }
  }
}`
				},

				trap: {
					story: {
						call: '트랩팀, 그물트랩 설계도 JSON을 만드세요.',
						summary: '괴물을 멈출 트랩의 재료와 작동 방식을 JSON으로 정리합니다.',
						mission: '트랩 제작 단서를 보고 종류, 재료, 작동방식을 입력하세요.'
					},
					role: {
						title: '트랩팀',
						icon: '🕸️',
						description: '괴물을 멈출 트랩을 제작하는 역할'
					},
					clues: [
						mission2trapStructureHint,
						'미션 1 실험 결과, 그물트랩이 가장 효과적이었습니다.',
						'그물트랩을 만들려면 그물, 고정핀, 작동줄이 필요합니다.',
						'괴물이 지나갈 때 줄을 당겨 작동하므로 작동방식은 당기기입니다.'
					],
					keyChips: ['방어도구', '트랩', '종류', '재료', '작동방식'],
					valueChips: ['"그물트랩"', '"그물"', '"고정핀"', '"작동줄"', '"당기기"'],
					initialJson: `{
  "방어도구": {
    "트랩": {
      "종류": "",
      "재료": [],
      "작동방식": ""
    }
  }
}`
				},

				attack: {
					story: {
						call: '대포팀, 불대포 설계도 JSON을 만드세요.',
						summary: '괴물을 약하게 만들 불대포의 재료와 발사 세기를 JSON으로 정리합니다.',
						mission: '대포 제작 단서를 보고 종류, 재료, 발사세기를 입력하세요.'
					},
					role: {
						title: '대포팀',
						icon: '🔥',
						description: '괴물을 약하게 만들 불대포를 제작하는 역할'
					},
					clues: [
						mission2cannonStructureHint,
						'미션 1 실험 결과, 불대포가 초록괴물을 가장 크게 약하게 했습니다.',
						'불대포를 만들려면 화염석, 발사관, 점화장치가 필요합니다.',
						'괴물을 크게 약하게 만들려면 발사세기는 3으로 정합니다.'
					],
					keyChips: ['방어도구', '대포', '종류', '재료', '발사세기'],
					valueChips: ['"불대포"', '"화염석"', '"발사관"', '"점화장치"', '3'],
					initialJson: `{
  "방어도구": {
    "대포": {
      "종류": "",
      "재료": [],
      "발사세기": 0
    }
  }
}`
				},

				scout: {
					story: {
						call: '정찰팀, 정찰 장비 설계도 JSON을 만드세요.',
						summary: '괴물 정보를 전달할 정찰 장비를 JSON으로 정리합니다.',
						mission: '정찰 장비 단서를 보고 장비, 보고대상, 경보단계를 입력하세요.'
					},
					role: {
						title: '정찰팀',
						icon: '🔭',
						description: '괴물 접근 정보를 다른 팀에게 전달하는 역할'
					},
					clues: [
						mission2scoutStructureHint,
						'괴물 정보를 빠르게 전달하려면 무전기가 필요합니다.',
						'정찰팀은 성벽팀, 트랩팀, 대포팀에게 보고해야 합니다.',
						'초록괴물이 도시 쪽으로 접근 중이므로 경보단계는 3입니다.'
					],
					keyChips: ['방어도구', '정찰장비', '장비', '보고대상', '경보단계'],
					valueChips: ['"무전기"', '"성벽팀"', '"트랩팀"', '"대포팀"', '3'],
					initialJson: `{
  "방어도구": {
    "정찰장비": {
      "장비": "",
      "보고대상": [],
      "경보단계": 0
    }
  }
}`
				}
			}
		},

		{
			id: 'final-defense',
			layerKey: 'finalDefense',
			title: '최종 방어 계획 실행',
			type: 'team-final',
			finalSubmitMode: 'full',
			requireSameFinalSubmissions: true,
			finalMismatchMessage:
				'팀원들의 최종방어작전 JSON이 서로 다릅니다. 회의 후 같은 작전을 다시 제출하세요.',
			effectKey: 'finalDefense',
			roleSuccessState: monsterDefenseRoleSuccessStates,
			successState: monsterDefenseMissionSuccessStates.finalDefense,
			simulationScope: 'room',
			waitForFinalResultCallback: true,

			initialJson: `
{
  "최종방어작전": {
    
  }
}`,

			finalAnswer: {
				최종방어작전: finalDefensePlan
			},

			roleMissions: {
				wall: {
					story: {
						call: '성벽팀, 최종 방어 계획의 성벽 정보를 공유하세요.',
						summary: '최종 계획에는 성벽 방어도구가 포함되어야 합니다.',
						mission: '팀원들과 함께 같은 최종방어작전 JSON을 완성하세요.'
					},
					role: {
						title: '성벽팀',
						icon: '🧱',
						description: '최종 계획에 성벽 정보를 제공하는 역할'
					},
					clues: [
						finalDefenseStructureHint,
						'괴물이 들어오지 못하게 성벽을 사용해야 합니다.',
						'키값 방어도구의 값에는 "성벽", "그물트랩", "불대포"가 들어갑니다.'
					],
					keyChips: ['최종방어작전', '목표', '방어도구', '실행'],
					valueChips: ['"성벽"', 'true']
				},

				trap: {
					story: {
						call: '트랩팀, 최종 방어 계획의 트랩 정보를 공유하세요.',
						summary: '최종 계획에는 가장 효과적인 트랩이 포함되어야 합니다.',
						mission: '팀원들과 함께 같은 최종방어작전 JSON을 완성하세요.'
					},
					role: {
						title: '트랩팀',
						icon: '🕸️',
						description: '최종 계획에 트랩 정보를 제공하는 역할'
					},
					clues: [
						finalDefenseStructureHint,
						'미션 1 실험 결과, 그물트랩이 가장 효과적이었습니다.',
						'최종실행 키의 값은 true입니다.'
					],
					keyChips: ['최종방어작전', '목표', '방어도구', '실행'],
					valueChips: ['"그물트랩"', 'true']
				},

				attack: {
					story: {
						call: '대포팀, 최종 방어 계획의 대포 정보를 공유하세요.',
						summary: '최종 계획에는 가장 효과적인 대포가 포함되어야 합니다.',
						mission: '팀원들과 함께 같은 최종방어작전 JSON을 완성하세요.'
					},
					role: {
						title: '대포팀',
						icon: '🔥',
						description: '최종 계획에 대포 정보를 제공하는 역할'
					},
					clues: [finalDefenseStructureHint, '괴물은 초록괴물입니다.'],
					keyChips: ['최종방어작전', '목표', '방어도구', '실행'],
					valueChips: ['"불대포"', 'true']
				},

				scout: {
					story: {
						call: '정찰팀, 최종 방어 계획의 목표 정보를 공유하세요.',
						summary: '최종 계획에는 괴물 이름과 침입 방향이 필요합니다.',
						mission: '팀원들과 함께 같은 최종방어작전 JSON을 완성하세요.'
					},
					role: {
						title: '정찰팀',
						icon: '🔭',
						description: '최종 계획에 괴물 정보와 침입 방향을 제공하는 역할'
					},
					clues: [
						finalDefenseStructureHint,
						'정찰 결과, 괴물은 초록괴물입니다.',
						'경보는 북쪽 감시탑에서 가장 먼저 울렸습니다.'
					],
					keyChips: ['최종방어작전', '목표', '괴물', '방향', '방어도구', '실행'],
					valueChips: ['"초록괴물"', '"북쪽"', 'true']
				}
			},

			finalSuccessMessage: '최종 방어 계획이 실행되었습니다. 공용화면에서 결과를 확인하세요.'
		}
	]
};
