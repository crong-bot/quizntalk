// src/lib/components/workplace/theme/monsterDefense/monsterDefenseCourse.js

import {
	monsterDefenseMissionSuccessStates,
	monsterDefenseRoleSuccessStates
} from './monsterDefenseLayers.js';

const finalDefensePlan = {
	괴물이름: '초록괴물',
	침입방향: '북쪽',
	성벽: {
		방향: '북쪽',
		문닫기: true,
		높이: 5
	},
	감시방법: '북쪽감시',
	트랩: {
		종류: '그물트랩',
		설치위치: '북쪽길',
		작동: true
	},
	대포: {
		종류: '물대포',
		발사조건: '몬스터가 트랩에 걸린 뒤',
		발사횟수: 4
	},
	작전순서: [
		'북쪽 성벽을 닫는다',
		'북쪽 길을 감시한다',
		'북쪽길에 그물트랩을 설치한다',
		'초록괴물이 트랩에 걸린 뒤 물대포를 4번 발사한다'
	],
	작전실행: true
};

export const monsterDefenseCourse = {
	id: 'monster-defense',
	title: '괴물 도시 방어 작전',
	subtitle: '역할별 JSON 단서를 해석하고, 팀 방어 작전을 완성하세요.',
	icon: '🛡️',
	themeId: 'monsterDefense',

	initialThemeState: {
		monsterTruth: {
			monsterName: '초록괴물',
			direction: '북쪽',
			weakness: '물',
			weapon: '물대포',
			wallDirection: '북쪽',
			trapDirection: '북쪽',
			trapName: '그물트랩',
			trapPosition: '북쪽길',
			detectMethod: '북쪽감시',
			fireCondition: '몬스터가 트랩에 걸린 뒤',
			fireCount: 4
		},

		defenseSetup: {
			monsterName: '',
			direction: '',
			weakness: '',
			weapon: '',
			wallDirection: '',
			trapDirection: '',
			trapName: '',
			trapPosition: '',
			detectMethod: '',
			fireCondition: '',
			fireCount: 0
		}
	},

	finalizeThemeResult({ room }) {
		const truth = room?.themeState?.monsterTruth ?? {};
		const setup = room?.themeState?.defenseSetup ?? {};

		const wallOk = setup.wallDirection === truth.wallDirection;

		const scoutOk =
			setup.monsterName === truth.monsterName &&
			setup.direction === truth.direction &&
			setup.detectMethod === truth.detectMethod;

		const trapOk =
			setup.trapName === truth.trapName &&
			setup.trapDirection === truth.trapDirection &&
			setup.trapPosition === truth.trapPosition;

		const cannonOk =
			setup.weapon === truth.weapon &&
			setup.fireCondition === truth.fireCondition &&
			setup.fireCount === truth.fireCount;

		if (wallOk && scoutOk && trapOk && cannonOk) {
			return {
				status: 'success',
				reason: 'allMatched'
			};
		}

		if (!wallOk) {
			return {
				status: 'fail',
				reason: 'wrongWall'
			};
		}

		if (!scoutOk) {
			return {
				status: 'fail',
				reason: 'wrongScout'
			};
		}

		if (!trapOk) {
			return {
				status: 'fail',
				reason: 'wrongTrap'
			};
		}

		return {
			status: 'fail',
			reason: 'wrongCannon'
		};
	},

	intro: {
		badge: 'CITY DEFENSE',
		title: '괴물 도시 방어 작전',
		subtitle: '성벽팀, 정찰팀, 트랩팀, 대포팀이 JSON 단서를 해석해 도시를 지켜냅니다.',
		image: '/images/themes/monster-defense/intro.png',
		imageAlt: '도시를 향해 다가오는 초록괴물과 방어 장치',
		summaryTitle: '현재 상황',
		summary:
			'초록괴물이 도시로 접근하고 있습니다. 한 사람의 정보만으로는 막을 수 없습니다. 각 팀이 자기 역할의 단서를 해석하고, 마지막에 모든 정보를 합쳐야 합니다.',
		goalTitle: '우리의 임무',
		missionGoal:
			'역할별 단서를 분석해 핵심 정보와 실행 방법을 찾고, 마지막에 팀 전체가 하나의 최종 방어 작전을 완성하세요.',
		steps: [
			'미션 1에서 각 팀은 자기 역할의 핵심 정보를 찾습니다.',
			'미션 2에서 각 팀은 자기 역할의 실행 방법을 찾습니다.',
			'미션 3에서 네 팀의 답을 합쳐 최종 방어 작전을 완성합니다.',
			'최종 작전이 맞으면 초록괴물을 막고, 틀리면 도시 방어에 실패합니다.'
		],
		tip: '힌트: 문자열은 "따옴표"로 감싸고, 숫자와 true/false는 따옴표 없이 입력해요.',
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
		subtitle: '팀원들의 JSON 정보를 합쳐 최종 방어 작전을 실행했습니다.',
		summaryTitle: '최종 결과',
		summary: '공용화면에서 초록괴물 침입과 방어 결과를 확인하세요.',
		primaryButtonText: '홈으로'
	},

	missions: [
		{
			id: 'role-core-info',
			layerKey: 'coreInfo',
			title: '미션 1. 내 역할의 핵심 정보 찾기',
			type: 'individual',
			effectKey: 'coreInfo',
			roleSuccessState: monsterDefenseRoleSuccessStates,
			successState: monsterDefenseMissionSuccessStates.scout,
			simulationScope: 'local',
			initialJson: `{
  "분석결과": {
    "정답": "",
    "이유": ""
  }
}`,

			roleMissions: {
				wall: {
					story: {
						call: '성벽팀, 동서남북 성벽 상태를 확인하세요.',
						summary: '괴물이 들어올 가능성이 가장 큰 방향의 성벽을 찾아야 합니다.',
						mission: '말로 된 단서를 읽고, 가장 먼저 막아야 할 방향과 이유를 JSON으로 정리하세요.'
					},
					role: {
						title: '성벽팀',
						icon: '🧱',
						description: '동서남북 성벽 중 가장 위험한 방향을 찾는 역할'
					},
					clues: [
						'도시에는 북쪽, 동쪽, 남쪽, 서쪽 네 방향의 입구가 있습니다.',
						'북쪽 입구는 아직 열려 있고, 근처에서 큰 발자국이 발견되었습니다.',
						'동쪽 입구와 남쪽 입구는 이미 닫혀 있어 괴물이 들어오기 어렵습니다.',
						'서쪽 입구도 열려 있지만, 발견된 긁힌 자국은 오래된 흔적으로 보입니다.',
						'성벽팀은 가장 먼저 막아야 할 방향을 찾아야 합니다.'
					],
					keyChips: ['방어방향', '이유'],
					valueChips: ['"북쪽"', '"북쪽 입구가 열려 있고 큰 발자국이 있기 때문입니다."'],
					initialJson: `{
  "방어방향": "",
  "이유": ""
}`,
					answer: {
						방어방향: '북쪽',
						이유: '북쪽 입구가 열려 있고 큰 발자국이 있기 때문입니다.'
					}
				},

				scout: {
					story: {
						call: '정찰팀, 괴물의 방향과 이름을 확인하세요.',
						summary: '정찰 기록과 괴물도감 정보를 비교하면 초록괴물의 정보를 찾을 수 있습니다.',
						mission: '단서를 읽고 괴물 이름, 침입 방향, 약점을 JSON으로 정리하세요.'
					},
					role: {
						title: '정찰팀',
						icon: '🔭',
						description: '괴물의 방향과 정체를 찾는 역할'
					},
					clues: [
						'가장 최근 경보는 북쪽에서 울렸습니다.',
						'정찰 기록에는 몸색이 초록이고 크기가 큰 괴물이 발견되었다고 적혀 있습니다.',
						'그 괴물은 날아오지 않고 길을 따라 걸어오고 있습니다.',
						'괴물도감에는 몸색이 초록이고 크기가 큰 괴물이 초록괴물로 기록되어 있습니다.',
						'초록괴물은 물을 피하는 모습을 보였기 때문에 약점은 물로 판단됩니다.'
					],
					keyChips: ['괴물이름', '침입방향', '약점', '이유'],
					valueChips: [
						'"초록괴물"',
						'"북쪽"',
						'"물"',
						'"정찰기록의 특징이 초록괴물과 일치하기 때문입니다."'
					],
					initialJson: `{
  "괴물이름": "",
  "침입방향": "",
  "약점": "",
  "이유": ""
}`,
					answer: {
						괴물이름: '초록괴물',
						침입방향: '북쪽',
						약점: '물',
						이유: '정찰기록의 특징이 초록괴물과 일치하기 때문입니다.'
					}
				},

				trap: {
					story: {
						call: '트랩팀, 효과 있는 트랩을 찾으세요.',
						summary: '초록괴물을 멈출 수 있는 트랩을 찾아야 합니다.',
						mission: '트랩 실험 단서를 읽고, 가장 효과가 높은 트랩과 이유를 JSON으로 정리하세요.'
					},
					role: {
						title: '트랩팀',
						icon: '🕸️',
						description: '초록괴물에게 효과 있는 트랩을 찾는 역할'
					},
					clues: [
						'초록괴물은 그물트랩에 걸렸을 때 가장 오래 움직이지 못했습니다.',
						'미끄럼기름도 어느 정도 효과가 있었지만, 초록괴물을 오래 붙잡지는 못했습니다.',
						'소리폭탄은 초록괴물에게 거의 효과가 없었습니다.',
						'트랩팀은 초록괴물을 가장 확실하게 멈출 수 있는 트랩을 골라야 합니다.'
					],
					keyChips: ['추천트랩', '이유'],
					valueChips: ['"그물트랩"', '"초록괴물에게 효과가 높기 때문입니다."'],
					initialJson: `{
  "추천트랩": "",
  "이유": ""
}`,
					answer: {
						추천트랩: '그물트랩',
						이유: '초록괴물에게 효과가 높기 때문입니다.'
					}
				},

				attack: {
					story: {
						call: '대포팀, 효과 있는 대포를 찾으세요.',
						summary: '초록괴물의 약점에 맞는 대포를 선택해야 합니다.',
						mission: '대포 실험 단서를 읽고, 가장 효과가 높은 대포와 이유를 JSON으로 정리하세요.'
					},
					role: {
						title: '대포팀',
						icon: '💧',
						description: '초록괴물에게 효과 있는 대포를 찾는 역할'
					},
					clues: [
						'불대포는 초록괴물에게 거의 효과가 없었습니다.',
						'물대포를 맞은 초록괴물은 크게 약해졌습니다.',
						'바람대포도 약간 효과가 있었지만, 물대포만큼 강하지는 않았습니다.',
						'대포팀은 초록괴물의 에너지를 가장 많이 줄일 수 있는 대포를 골라야 합니다.'
					],
					keyChips: ['추천대포', '이유'],
					valueChips: ['"물대포"', '"초록괴물에게 효과가 높기 때문입니다."'],
					initialJson: `{
  "추천대포": "",
  "이유": ""
}`,
					answer: {
						추천대포: '물대포',
						이유: '초록괴물에게 효과가 높기 때문입니다.'
					}
				}
			}
		},

		{
			id: 'role-execution-method',
			layerKey: 'executionMethod',
			title: '미션 2. 내 역할의 실행 방법 찾기',
			type: 'individual',
			effectKey: 'executionMethod',
			roleSuccessState: monsterDefenseRoleSuccessStates,
			successState: monsterDefenseMissionSuccessStates.prepare,
			simulationScope: 'local',
			initialJson: `{
  "실행방법": {}
}`,

			roleMissions: {
				wall: {
					story: {
						call: '성벽팀, 북쪽 성벽을 어떻게 준비할지 찾으세요.',
						summary: '미션 1에서 찾은 방어 방향은 북쪽입니다.',
						mission: '성벽 설치 단서를 읽고, 북쪽 성벽의 실행 방법을 JSON으로 정리하세요.'
					},
					role: {
						title: '성벽팀',
						icon: '🧱',
						description: '북쪽 성벽을 설치하는 방법을 찾는 역할'
					},
					clues: [
						'북쪽에서 괴물이 들어올 가능성이 가장 높습니다.',
						'북쪽 성벽은 높이 5로 세워야 괴물의 이동을 막을 수 있습니다.',
						'성벽의 문은 반드시 닫아야 합니다.',
						'서쪽 성벽은 보조 방어선이라 높이 3이면 충분하지만, 이번 작전의 핵심 방향은 아닙니다.'
					],
					keyChips: ['성벽방향', '문닫기', '높이'],
					valueChips: ['"북쪽"', 'true', '5'],
					initialJson: `{
  "성벽방향": "",
  "문닫기": false,
  "높이": 0
}`,
					answer: {
						성벽방향: '북쪽',
						문닫기: true,
						높이: 5
					},
					themePatch: {
						'themeState.defenseSetup.wallDirection': '북쪽'
					}
				},

				scout: {
					story: {
						call: '정찰팀, 초록괴물 감시 방법을 찾으세요.',
						summary: '괴물이 들어오는 방향을 계속 확인할 감시 방법이 필요합니다.',
						mission:
							'감시 방법 단서를 읽고, 초록괴물의 침입 방향과 감시 방법을 JSON으로 정리하세요.'
					},
					role: {
						title: '정찰팀',
						icon: '🔭',
						description: '괴물 감시 방법을 찾는 역할'
					},
					clues: [
						'초록괴물은 북쪽에서 길을 따라 걸어오고 있습니다.',
						'북쪽에서 걸어오는 큰 괴물은 북쪽감시로 계속 확인해야 합니다.',
						'동쪽에서 날아오는 괴물은 하늘감시가 필요하지만, 이번 괴물은 날아오지 않습니다.',
						'서쪽에서 숨어오는 괴물은 그림자감시가 필요하지만, 이번 경보는 서쪽이 아닙니다.'
					],
					keyChips: ['괴물이름', '침입방향', '감시방법'],
					valueChips: ['"초록괴물"', '"북쪽"', '"북쪽감시"'],
					initialJson: `{
  "괴물이름": "",
  "침입방향": "",
  "감시방법": ""
}`,
					answer: {
						괴물이름: '초록괴물',
						침입방향: '북쪽',
						감시방법: '북쪽감시'
					},
					themePatch: {
						'themeState.defenseSetup.monsterName': '초록괴물',
						'themeState.defenseSetup.direction': '북쪽',
						'themeState.defenseSetup.detectMethod': '북쪽감시'
					}
				},

				trap: {
					story: {
						call: '트랩팀, 그물트랩 설치 방법을 찾으세요.',
						summary: '트랩은 괴물이 실제로 들어오는 길에 설치해야 합니다.',
						mission: '트랩 설치 단서를 읽고, 그물트랩의 방향과 위치를 JSON으로 정리하세요.'
					},
					role: {
						title: '트랩팀',
						icon: '🕸️',
						description: '트랩 설치 위치와 작동 방법을 찾는 역할'
					},
					clues: [
						'미션 1에서 초록괴물에게 가장 효과가 높은 트랩은 그물트랩으로 확인되었습니다.',
						'그물트랩은 괴물이 실제로 지나가는 길에 설치해야 효과가 있습니다.',
						'초록괴물은 북쪽에서 들어오므로 트랩은 북쪽길에 설치해야 합니다.',
						'트랩은 작동 상태가 true일 때만 괴물을 붙잡을 수 있습니다.'
					],
					keyChips: ['트랩', '방향', '설치위치', '작동'],
					valueChips: ['"그물트랩"', '"북쪽"', '"북쪽길"', 'true'],
					initialJson: `{
  "트랩": "",
  "방향": "",
  "설치위치": "",
  "작동": false
}`,
					answer: {
						트랩: '그물트랩',
						방향: '북쪽',
						설치위치: '북쪽길',
						작동: true
					},
					themePatch: {
						'themeState.defenseSetup.trapName': '그물트랩',
						'themeState.defenseSetup.trapDirection': '북쪽',
						'themeState.defenseSetup.trapPosition': '북쪽길'
					}
				},

				attack: {
					story: {
						call: '대포팀, 물대포 발사 조건을 찾으세요.',
						summary: '물대포는 괴물이 트랩에 걸린 뒤 여러 번 발사해야 합니다.',
						mission: '대포 발사 단서를 읽고, 물대포의 발사 조건과 횟수를 JSON으로 정리하세요.'
					},
					role: {
						title: '대포팀',
						icon: '💧',
						description: '물대포 발사 조건을 찾는 역할'
					},
					clues: [
						'미션 1에서 초록괴물에게 가장 효과가 높은 대포는 물대포로 확인되었습니다.',
						'물대포는 괴물이 트랩에 걸린 뒤에 발사해야 가장 효과가 큽니다.',
						'초록괴물의 에너지를 충분히 줄이려면 물대포를 4번 발사해야 합니다.',
						'불대포는 초록괴물에게 효과가 낮으므로 이번 작전에 사용하지 않습니다.'
					],
					keyChips: ['대포', '발사조건', '발사횟수'],
					valueChips: ['"물대포"', '"몬스터가 트랩에 걸린 뒤"', '4'],
					initialJson: `{
  "대포": "",
  "발사조건": "",
  "발사횟수": 0
}`,
					answer: {
						대포: '물대포',
						발사조건: '몬스터가 트랩에 걸린 뒤',
						발사횟수: 4
					},
					themePatch: {
						'themeState.defenseSetup.weapon': '물대포',
						'themeState.defenseSetup.fireCondition': '몬스터가 트랩에 걸린 뒤',
						'themeState.defenseSetup.fireCount': 4
					}
				}
			}
		},

		{
			id: 'final-defense',
			layerKey: 'finalDefense',
			title: '미션 3. 팀 방어 작전 완성하기',
			type: 'team-final',
			effectKey: 'citySaved',
			roleSuccessState: monsterDefenseRoleSuccessStates,
			successState: monsterDefenseMissionSuccessStates.finalDefense,
			simulationScope: 'room',
			initialJson: `{
  "최종방어작전": {
    "괴물이름": "",
    "침입방향": "",
    "성벽": {
      "방향": "",
      "문닫기": false,
      "높이": 0
    },
    "감시방법": "",
    "트랩": {
      "종류": "",
      "설치위치": "",
      "작동": false
    },
    "대포": {
      "종류": "",
      "발사조건": "",
      "발사횟수": 0
    },
    "작전순서": [],
    "작전실행": false
  }
}`,

			finalAnswer: {
				최종방어작전: finalDefensePlan
			},

			roleMissions: {
				wall: {
					story: {
						call: '성벽팀, 성벽 정보를 팀에 알려 주세요.',
						summary: '최종 방어 작전에는 성벽팀이 찾은 방향과 성벽 설정이 필요합니다.',
						mission: '팀원들과 상의해 같은 최종방어작전 JSON을 완성하세요.'
					},
					role: {
						title: '성벽팀',
						icon: '🧱',
						description: '최종 작전에 성벽 정보를 제공하는 역할'
					},
					clues: [
						'성벽팀이 찾은 방어 방향은 북쪽입니다.',
						'성벽의 문닫기 값은 true입니다.',
						'성벽의 높이는 숫자 5입니다.',
						'이 정보를 팀원들에게 알려 최종 방어 작전에 넣어야 합니다.'
					],
					keyChips: ['최종방어작전', '성벽', '방향', '문닫기', '높이'],
					valueChips: ['"북쪽"', 'true', '5'],
					finalPiece: {
						key: '최종방어작전',
						value: finalDefensePlan
					}
				},

				scout: {
					story: {
						call: '정찰팀, 괴물 이름과 침입 방향을 팀에 알려 주세요.',
						summary: '최종 방어 작전에는 정찰팀이 찾은 초록괴물 정보가 필요합니다.',
						mission: '팀원들과 상의해 같은 최종방어작전 JSON을 완성하세요.'
					},
					role: {
						title: '정찰팀',
						icon: '🔭',
						description: '최종 작전에 괴물 이름과 침입 방향을 제공하는 역할'
					},
					clues: [
						'정찰팀이 찾은 괴물 이름은 초록괴물입니다.',
						'침입 방향은 북쪽입니다.',
						'감시 방법은 북쪽감시입니다.',
						'이 정보를 팀원들과 공유해야 최종 방어 작전을 완성할 수 있습니다.'
					],
					keyChips: ['최종방어작전', '괴물이름', '침입방향', '감시방법'],
					valueChips: ['"초록괴물"', '"북쪽"', '"북쪽감시"'],
					finalPiece: {
						key: '최종방어작전',
						value: finalDefensePlan
					}
				},

				trap: {
					story: {
						call: '트랩팀, 트랩 종류와 설치 위치를 팀에 알려 주세요.',
						summary: '최종 방어 작전에는 트랩팀이 찾은 그물트랩 정보가 필요합니다.',
						mission: '팀원들과 상의해 같은 최종방어작전 JSON을 완성하세요.'
					},
					role: {
						title: '트랩팀',
						icon: '🕸️',
						description: '최종 작전에 트랩 정보를 제공하는 역할'
					},
					clues: [
						'트랩팀이 찾은 트랩 종류는 그물트랩입니다.',
						'그물트랩의 설치 위치는 북쪽길입니다.',
						'트랩의 작동 값은 true입니다.',
						'이 정보를 팀원들에게 알려 최종 방어 작전에 넣어야 합니다.'
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
						call: '대포팀, 대포 종류와 발사 조건을 팀에 알려 주세요.',
						summary: '최종 방어 작전에는 대포팀이 찾은 물대포 정보가 필요합니다.',
						mission: '팀원들과 상의해 같은 최종방어작전 JSON을 완성하세요.'
					},
					role: {
						title: '대포팀',
						icon: '💧',
						description: '최종 작전에 대포 정보를 제공하는 역할'
					},
					clues: [
						'대포팀이 찾은 대포 종류는 물대포입니다.',
						'물대포의 발사 조건은 몬스터가 트랩에 걸린 뒤입니다.',
						'물대포의 발사 횟수는 숫자 4입니다.',
						'이 정보를 팀원들과 공유해야 최종 방어 작전을 완성할 수 있습니다.'
					],
					keyChips: ['최종방어작전', '대포', '종류', '발사조건', '발사횟수'],
					valueChips: ['"물대포"', '"몬스터가 트랩에 걸린 뒤"', '4'],
					finalPiece: {
						key: '최종방어작전',
						value: finalDefensePlan
					}
				}
			},

			finalSuccessMessage:
				'최종 방어 작전이 실행되었습니다. 공용화면에서 초록괴물 침입 결과를 확인하세요.'
		}
	]
};
