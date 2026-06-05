// src/lib/components/workplace/theme/monsterDefense/monsterDefenseCourse.js

import {
	monsterDefenseMissionSuccessStates,
	monsterDefenseRoleSuccessStates
} from './monsterDefenseLayers.js';

const finalDefensePlan = {
	괴물이름: '초록괴물',
	성벽: {
		방향: '북쪽',
		문닫기: true
	},
	트랩: {
		종류: '그물트랩',
		설치위치: '북쪽길',
		작동: true
	},
	대포: {
		종류: '물대포',
		작동: true
	},
	작전실행: true
};

export const monsterDefenseCourse = {
	id: 'monster-defense',
	title: '괴물 도시 방어 작전',
	subtitle: '정찰하고, 방어 도구를 만들고, 최종 방어 계획으로 도시를 지켜요.',
	icon: '🛡️',
	themeId: 'monsterDefense',

	intro: {
		badge: 'CITY DEFENSE',
		title: '괴물 도시 방어 작전',
		subtitle: 'JSON으로 정찰 기록과 방어 계획을 만들고, 최종 작전을 실행하세요.',
		image: '/images/themes/monster-defense/intro.png',
		imageAlt: '도시를 향해 다가오는 초록괴물과 방어 장치',
		summaryTitle: '현재 상황',
		summary:
			'도시에 괴물이 접근한다는 경보가 울렸습니다. 아직 괴물은 보이지 않습니다. 정찰 기록을 보고 예상한 뒤, 방어 도구를 준비하고, 마지막에 최종 방어 계획을 실행해야 합니다.',
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
			id: 'scout',
			name: '민서',
			roleName: '정찰팀',
			avatarSrc: '/images/avatars/1.png'
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
		}
	],

	completion: {
		badge: 'DEFENSE COMPLETE',
		title: '도시 방어 작전 완료!',
		subtitle: '최종 방어 계획이 실행되었습니다.',
		summaryTitle: '최종 결과',
		summary: '공용화면에서 괴물 침입과 방어 결과를 확인하세요.',
		primaryButtonText: '홈으로'
	},

	missions: [
		{
			id: 'scout',
			layerKey: 'scout',
			title: '미션 1. 정찰 기록 만들기',
			type: 'individual',
			effectKey: 'scout',
			roleSuccessState: monsterDefenseRoleSuccessStates,
			successState: monsterDefenseMissionSuccessStates.scout,
			simulationScope: 'none',

			roleMissions: {
				wall: {
					story: {
						call: '성벽팀, 성벽 주변 정찰 기록을 만드세요.',
						summary: '어느 방향이 위험해 보이는지 판단해 JSON으로 정리합니다.',
						mission: '정찰 단서를 보고 예상 방향과 근거 단서를 입력하세요.'
					},
					role: {
						title: '성벽팀',
						icon: '🧱',
						description: '성벽 주변 흔적을 보고 위험 방향을 판단하는 역할'
					},
					clues: [
						'북쪽 입구 근처에는 큰 발자국이 있습니다.',
						'동쪽 입구 근처에는 작은 발자국이 흩어져 있습니다.',
						'남쪽 입구는 닫혀 있습니다.',
						'서쪽에는 오래된 긁힌 자국이 있습니다.'
					],
					keyChips: ['정찰', '예상방향', '근거단서'],
					valueChips: ['"북쪽"', '"동쪽"', '"남쪽"', '"서쪽"', '"큰발자국"', '"작은발자국"', '"긁힌자국"'],
					initialJson: `{
  "정찰": {
    "예상방향": "",
    "근거단서": ""
  }
}`
				},

				scout: {
					story: {
						call: '정찰팀, 괴물 정찰 기록을 만드세요.',
						summary: '비슷한 괴물 단서를 비교해 예상 괴물을 입력합니다.',
						mission: '정찰 단서를 보고 괴물 이름, 침입 방향, 몸색을 입력하세요.'
					},
					role: {
						title: '정찰팀',
						icon: '🔭',
						description: '괴물의 정체와 침입 방향을 추측하는 역할'
					},
					clues: [
						'정찰 기록에는 초록색 괴물이 보였다고 적혀 있습니다.',
						'초록괴물은 크기가 크고 도시 쪽으로 걸어옵니다.',
						'숲괴물도 초록색이지만 크기가 작고 숲에서 잘 나오지 않습니다.',
						'경보는 북쪽 감시탑에서 가장 먼저 울렸습니다.'
					],
					keyChips: ['정찰', '괴물이름', '침입방향', '몸색'],
					valueChips: ['"초록괴물"', '"숲괴물"', '"북쪽"', '"동쪽"', '"초록"'],
					initialJson: `{
  "정찰": {
    "괴물이름": "",
    "침입방향": "",
    "몸색": ""
  }
}`
				},

				trap: {
					story: {
						call: '트랩팀, 트랩 실험 기록을 만드세요.',
						summary: '어떤 트랩이 좋아 보이는지 판단해 JSON으로 정리합니다.',
						mission: '트랩 실험 단서를 보고 트랩 종류와 효과를 입력하세요.'
					},
					role: {
						title: '트랩팀',
						icon: '🕸️',
						description: '괴물을 멈출 트랩을 판단하는 역할'
					},
					clues: [
						'그물트랩은 초록괴물을 오래 멈추게 했습니다.',
						'미끄럼기름은 처음에는 효과가 있었지만 금방 풀렸습니다.',
						'소리폭탄은 거의 효과가 없었습니다.'
					],
					keyChips: ['정찰', '트랩종류', '효과'],
					valueChips: ['"그물트랩"', '"미끄럼기름"', '"소리폭탄"', '"높음"', '"보통"', '"낮음"'],
					initialJson: `{
  "정찰": {
    "트랩종류": "",
    "효과": ""
  }
}`
				},

				attack: {
					story: {
						call: '대포팀, 대포 실험 기록을 만드세요.',
						summary: '어떤 대포가 좋아 보이는지 판단해 JSON으로 정리합니다.',
						mission: '대포 실험 단서를 보고 대포 종류와 효과를 입력하세요.'
					},
					role: {
						title: '대포팀',
						icon: '💧',
						description: '괴물을 약하게 만들 대포를 판단하는 역할'
					},
					clues: [
						'물대포를 맞은 초록괴물은 크게 약해졌습니다.',
						'불대포는 거의 효과가 없었습니다.',
						'바람대포는 조금 밀어냈지만 금방 다시 움직였습니다.'
					],
					keyChips: ['정찰', '대포종류', '효과'],
					valueChips: ['"물대포"', '"불대포"', '"바람대포"', '"높음"', '"보통"', '"낮음"'],
					initialJson: `{
  "정찰": {
    "대포종류": "",
    "효과": ""
  }
}`
				}
			}
		},

		{
			id: 'prepare-tools',
			layerKey: 'prepareTools',
			title: '미션 2. 방어 도구 생성하기',
			type: 'individual',
			effectKey: 'prepareTools',
			roleSuccessState: monsterDefenseRoleSuccessStates,
			successState: monsterDefenseMissionSuccessStates.prepare,
			simulationScope: 'none',

			roleMissions: {
				wall: {
					story: {
						call: '성벽팀, 성벽 도구 JSON을 만드세요.',
						summary: '성벽을 어느 방향에 세울지와 문을 닫을지 정합니다.',
						mission: '성벽의 방향과 문닫기 값을 입력하세요.'
					},
					role: {
						title: '성벽팀',
						icon: '🧱',
						description: '성벽 도구를 만드는 역할'
					},
					clues: [
						'위험하다고 생각하는 방향에 성벽을 준비해야 합니다.',
						'문닫기 값이 true이면 성벽 문이 닫힌 상태입니다.',
						'문닫기 값이 false이면 성벽 문이 열린 상태입니다.'
					],
					keyChips: ['방어도구', '성벽', '방향', '문닫기'],
					valueChips: ['"북쪽"', '"동쪽"', '"남쪽"', '"서쪽"', 'true', 'false'],
					initialJson: `{
  "방어도구": {
    "성벽": {
      "방향": "",
      "문닫기": false
    }
  }
}`
				},

				scout: {
					story: {
						call: '정찰팀, 괴물 정보 JSON을 만드세요.',
						summary: '최종 계획에 넣을 괴물 정보를 정리합니다.',
						mission: '괴물 이름과 침입 방향을 입력하세요.'
					},
					role: {
						title: '정찰팀',
						icon: '🔭',
						description: '최종 계획에 들어갈 괴물 정보를 정리하는 역할'
					},
					clues: [
						'정찰 기록을 바탕으로 괴물 이름을 입력합니다.',
						'경보가 울린 방향을 바탕으로 침입 방향을 입력합니다.'
					],
					keyChips: ['방어도구', '괴물이름', '침입방향'],
					valueChips: ['"초록괴물"', '"숲괴물"', '"북쪽"', '"동쪽"', '"남쪽"', '"서쪽"'],
					initialJson: `{
  "방어도구": {
    "괴물이름": "",
    "침입방향": ""
  }
}`
				},

				trap: {
					story: {
						call: '트랩팀, 트랩 도구 JSON을 만드세요.',
						summary: '트랩의 종류, 설치 위치, 작동 여부를 정합니다.',
						mission: '트랩 종류, 설치위치, 작동 값을 입력하세요.'
					},
					role: {
						title: '트랩팀',
						icon: '🕸️',
						description: '트랩 도구를 만드는 역할'
					},
					clues: [
						'효과가 좋아 보이는 트랩을 선택합니다.',
						'괴물이 지나갈 것 같은 길에 설치해야 합니다.',
						'작동 값이 true이면 트랩이 작동합니다.'
					],
					keyChips: ['방어도구', '트랩', '종류', '설치위치', '작동'],
					valueChips: ['"그물트랩"', '"미끄럼기름"', '"북쪽길"', '"동쪽길"', '"남쪽길"', 'true', 'false'],
					initialJson: `{
  "방어도구": {
    "트랩": {
      "종류": "",
      "설치위치": "",
      "작동": false
    }
  }
}`
				},

				attack: {
					story: {
						call: '대포팀, 대포 도구 JSON을 만드세요.',
						summary: '대포의 종류와 작동 여부를 정합니다.',
						mission: '대포 종류와 작동 값을 입력하세요.'
					},
					role: {
						title: '대포팀',
						icon: '💧',
						description: '대포 도구를 만드는 역할'
					},
					clues: [
						'효과가 좋아 보이는 대포를 선택합니다.',
						'작동 값이 true이면 대포가 준비된 상태입니다.'
					],
					keyChips: ['방어도구', '대포', '종류', '작동'],
					valueChips: ['"물대포"', '"불대포"', '"바람대포"', 'true', 'false'],
					initialJson: `{
  "방어도구": {
    "대포": {
      "종류": "",
      "작동": false
    }
  }
}`
				}
			}
		},

		{
			id: 'final-defense',
			layerKey: 'finalDefense',
			title: '미션 3. 방어 계획 실행하기',
			type: 'team-final',
			finalSubmitMode: 'full',
			effectKey: 'finalDefense',
			roleSuccessState: monsterDefenseRoleSuccessStates,
			successState: monsterDefenseMissionSuccessStates.finalDefense,
			simulationScope: 'room',
			waitForFinalResultCallback: true,
			initialJson: `{
  "최종방어작전": {
    "괴물이름": "",
    "성벽": {
      "방향": "",
      "문닫기": false
    },
    "트랩": {
      "종류": "",
      "설치위치": "",
      "작동": false
    },
    "대포": {
      "종류": "",
      "작동": false
    },
    "작전실행": false
  }
}`,

			finalAnswer: {
				최종방어작전: finalDefensePlan
			},

			roleMissions: {
				wall: {
					story: {
						call: '성벽팀, 최종 방어 계획의 성벽 정보를 공유하세요.',
						summary: '최종 계획에는 성벽의 방향과 문닫기 값이 필요합니다.',
						mission: '팀원들과 함께 같은 최종방어작전 JSON을 완성하세요.'
					},
					role: {
						title: '성벽팀',
						icon: '🧱',
						description: '최종 계획에 성벽 정보를 제공하는 역할'
					},
					clues: ['성벽은 괴물이 실제로 오는 방향에 있어야 합니다.', '성벽 문은 닫혀 있어야 합니다.'],
					keyChips: ['최종방어작전', '성벽', '방향', '문닫기'],
					valueChips: ['"북쪽"', 'true'],
					finalPiece: {
						key: '최종방어작전',
						value: finalDefensePlan
					}
				},

				scout: {
					story: {
						call: '정찰팀, 최종 방어 계획의 괴물 정보를 공유하세요.',
						summary: '최종 계획에는 괴물 이름이 필요합니다.',
						mission: '팀원들과 함께 같은 최종방어작전 JSON을 완성하세요.'
					},
					role: {
						title: '정찰팀',
						icon: '🔭',
						description: '최종 계획에 괴물 정보를 제공하는 역할'
					},
					clues: ['괴물은 초록괴물로 판단하는 것이 가장 안전합니다.', '괴물은 북쪽에서 접근합니다.'],
					keyChips: ['최종방어작전', '괴물이름'],
					valueChips: ['"초록괴물"'],
					finalPiece: {
						key: '최종방어작전',
						value: finalDefensePlan
					}
				},

				trap: {
					story: {
						call: '트랩팀, 최종 방어 계획의 트랩 정보를 공유하세요.',
						summary: '최종 계획에는 트랩 종류, 설치위치, 작동 값이 필요합니다.',
						mission: '팀원들과 함께 같은 최종방어작전 JSON을 완성하세요.'
					},
					role: {
						title: '트랩팀',
						icon: '🕸️',
						description: '최종 계획에 트랩 정보를 제공하는 역할'
					},
					clues: [
						'트랩은 괴물이 지나가는 길에 있어야 합니다.',
						'그물트랩은 초록괴물을 멈추는 데 효과적입니다.',
						'트랩은 작동 true 상태여야 합니다.'
					],
					keyChips: ['최종방어작전', '트랩', '종류', '설치위치', '작동'],
					valueChips: ['"그물트랩"', '"북쪽길"', 'true'],
					finalPiece: {
						key: '최종방어작전',
						value: finalDefensePlan
					}
				},

				attack: {
					story: {
						call: '대포팀, 최종 방어 계획의 대포 정보를 공유하세요.',
						summary: '최종 계획에는 대포 종류와 작동 값이 필요합니다.',
						mission: '팀원들과 함께 같은 최종방어작전 JSON을 완성하세요.'
					},
					role: {
						title: '대포팀',
						icon: '💧',
						description: '최종 계획에 대포 정보를 제공하는 역할'
					},
					clues: ['물대포는 초록괴물에게 효과적입니다.', '대포는 작동 true 상태여야 합니다.'],
					keyChips: ['최종방어작전', '대포', '종류', '작동'],
					valueChips: ['"물대포"', 'true'],
					finalPiece: {
						key: '최종방어작전',
						value: finalDefensePlan
					}
				}
			},

			finalSuccessMessage: '최종 방어 계획이 실행되었습니다. 공용화면에서 결과를 확인하세요.'
		}
	]
};