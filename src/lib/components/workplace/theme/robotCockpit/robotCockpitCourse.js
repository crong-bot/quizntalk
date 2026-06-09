// src/lib/components/workplace/theme/robotCockpit/robotCockpitCourse.js

import {
	robotCockpitMissionSuccessStates,
	robotCockpitRoleSuccessStates
} from './robotCockpitLayers.js';

export const robotCockpitCourse = {
	id: 'robot-cockpit',
	title: '거대 로봇 콕핏 작전',
	subtitle: 'JSON 명령으로 로봇에 탑승하고 HUD를 켠 뒤 목표 지점을 공격하세요.',
	icon: '🤖',
	themeId: 'robotCockpit',
	difficulty: 'JSON 고수',
	intro: {
		badge: 'ROBOT STARTUP',
		title: '거대 로봇 콕핏 작전',
		subtitle: '멀리 보이는 로봇에 탑승하고, HUD를 켠 뒤 목표 지점을 공격하세요.',
		image: '/images/themes/robot-cockpit/outside.png',
		imageAlt: '멀리서 보이는 거대 로봇',
		summaryTitle: '현재 상황',
		summary:
			'거대 로봇이 대기 중입니다. 먼저 콕핏에 진입하고, HUD를 켠 뒤 목표 지점을 조준해야 합니다.',
		goalTitle: '우리의 임무',
		missionGoal:
			'JSON 명령을 완성해 로봇의 조종석으로 들어가고, 화면을 켠 뒤 목표 지점으로 미사일을 발사하세요.',
		steps: [
			'미션 1에서 콕핏에 진입합니다.',
			'미션 2에서 HUD 전원을 켜고 좌우 시야를 확인합니다.',
			'미션 3에서 목표를 조준하고 미사일을 발사합니다.'
		],
		tip: '힌트: true / false 값은 따옴표 없이 입력해야 합니다.',
		buttonText: '작전 시작하기'
	},

	roles: [
		{
			id: 'pilot',
			name: '민서',
			roleName: '조종',
			avatarSrc: '/images/avatars/1.png'
		},
		{
			id: 'sensor',
			name: '준호',
			roleName: '센서',
			avatarSrc: '/images/avatars/2.png'
		},
		{
			id: 'weapon',
			name: '서연',
			roleName: '무장',
			avatarSrc: '/images/avatars/3.png'
		},
		{
			id: 'engineer',
			name: '도윤',
			roleName: '정비',
			avatarSrc: '/images/avatars/4.png'
		}
	],

	missions: [
		{
			id: 'enter-cockpit',
			title: '콕핏 진입',
			type: 'individual',
			roleSuccessState: robotCockpitRoleSuccessStates.enterCockpit,
			successState: robotCockpitMissionSuccessStates.enterCockpit,
			simulationScope: 'room',
			initialJson: `{
  "콕핏입장": false
}`,

			roleMissions: {
				pilot: {
					story: {
						call: '조종 담당, 로봇에 탑승할 준비를 하세요.',
						summary: '멀리 보이는 로봇의 콕핏으로 진입해야 합니다.',
						mission: '콕핏입장 값을 true로 바꾸세요.'
					},
					role: {
						title: '조종 담당',
						icon: '🕹️',
						description: '로봇 탑승 명령을 입력하는 역할'
					},
					clues: ['콕핏에 들어가려면 "콕핏입장" 값은 true입니다.'],
					keyChips: ['콕핏입장'],
					valueChips: ['true', 'false'],
					answer: {
						콕핏입장: true
					}
				},

				sensor: {
					story: {
						call: '센서 담당, 콕핏 진입 상태를 확인하세요.',
						summary: '외부 화면에서 내부 조종석 화면으로 전환해야 합니다.',
						mission: '콕핏입장 값을 true로 바꾸세요.'
					},
					role: {
						title: '센서 담당',
						icon: '📡',
						description: '진입 신호를 확인하는 역할'
					},
					clues: ['콕핏 화면으로 들어가려면 "콕핏입장"은 true입니다.'],
					keyChips: ['콕핏입장'],
					valueChips: ['true', 'false'],
					answer: {
						콕핏입장: true
					}
				},

				weapon: {
					story: {
						call: '무장 담당, 콕핏 진입 명령을 동기화하세요.',
						summary: '무기 시스템을 쓰려면 먼저 조종석에 들어가야 합니다.',
						mission: '콕핏입장 값을 true로 바꾸세요.'
					},
					role: {
						title: '무장 담당',
						icon: '🚀',
						description: '무기 시스템 준비 전 진입을 확인하는 역할'
					},
					clues: ['무장 시스템 준비 전 "콕핏입장" 값은 true여야 합니다.'],
					keyChips: ['콕핏입장'],
					valueChips: ['true', 'false'],
					answer: {
						콕핏입장: true
					}
				},

				engineer: {
					story: {
						call: '정비 담당, 내부 시스템 진입을 확인하세요.',
						summary: '로봇 내부 시스템에 접속해야 다음 단계를 진행할 수 있습니다.',
						mission: '콕핏입장 값을 true로 바꾸세요.'
					},
					role: {
						title: '정비 담당',
						icon: '🔧',
						description: '내부 시스템 진입을 담당하는 역할'
					},
					clues: ['내부 시스템에 들어가려면 "콕핏입장" 값은 true입니다.'],
					keyChips: ['콕핏입장'],
					valueChips: ['true', 'false'],
					answer: {
						콕핏입장: true
					}
				}
			}
		},

		{
			id: 'power-on',
			title: 'HUD 전원 켜기',
			type: 'individual',
			roleSuccessState: robotCockpitRoleSuccessStates.powerOn,
			successState: robotCockpitMissionSuccessStates.powerOn,
			simulationScope: 'room',
			initialJson: `{
  "HUD전원": false,
  "시선확인": false
}`,

			roleMissions: {
				pilot: {
					story: {
						call: '조종 담당, HUD를 켜고 좌우 시야를 확인하세요.',
						summary: '콕핏 화면은 켜졌지만 HUD가 아직 꺼져 있습니다.',
						mission: 'HUD전원과 시선확인을 true로 바꾸세요.'
					},
					role: {
						title: '조종 담당',
						icon: '🕹️',
						description: 'HUD와 시선 이동을 담당하는 역할'
					},
					clues: [
						'HUD를 켜려면 "HUD전원"은 true입니다.',
						'좌우를 확인하려면 "시선확인"은 true입니다.'
					],
					keyChips: ['HUD전원', '시선확인'],
					valueChips: ['true', 'false'],
					answer: {
						HUD전원: true,
						시선확인: true
					}
				},

				sensor: {
					story: {
						call: '센서 담당, 주변 감지 화면을 켜세요.',
						summary: '센서 HUD를 켜고 좌우 시야를 확인해야 합니다.',
						mission: 'HUD전원과 시선확인을 true로 바꾸세요.'
					},
					role: {
						title: '센서 담당',
						icon: '📡',
						description: '주변 감지와 시야 확인을 담당하는 역할'
					},
					clues: [
						'센서 HUD를 켜려면 "HUD전원"은 true입니다.',
						'좌우 감지를 하려면 "시선확인"은 true입니다.'
					],
					keyChips: ['HUD전원', '시선확인'],
					valueChips: ['true', 'false'],
					answer: {
						HUD전원: true,
						시선확인: true
					}
				},

				weapon: {
					story: {
						call: '무장 담당, 조준 화면을 준비하세요.',
						summary: '조준하려면 HUD가 켜지고 시야 확인이 끝나야 합니다.',
						mission: 'HUD전원과 시선확인을 true로 바꾸세요.'
					},
					role: {
						title: '무장 담당',
						icon: '🚀',
						description: '조준 화면 준비를 담당하는 역할'
					},
					clues: [
						'조준 화면을 켜려면 "HUD전원"은 true입니다.',
						'주변을 확인하려면 "시선확인"은 true입니다.'
					],
					keyChips: ['HUD전원', '시선확인'],
					valueChips: ['true', 'false'],
					answer: {
						HUD전원: true,
						시선확인: true
					}
				},

				engineer: {
					story: {
						call: '정비 담당, 전원 상태를 안정화하세요.',
						summary: 'HUD 전원을 켜고 좌우 화면 움직임을 확인해야 합니다.',
						mission: 'HUD전원과 시선확인을 true로 바꾸세요.'
					},
					role: {
						title: '정비 담당',
						icon: '🔧',
						description: 'HUD 전원 안정화를 담당하는 역할'
					},
					clues: [
						'전원 안정화를 위해 "HUD전원"은 true입니다.',
						'화면 확인을 위해 "시선확인"은 true입니다.'
					],
					keyChips: ['HUD전원', '시선확인'],
					valueChips: ['true', 'false'],
					answer: {
						HUD전원: true,
						시선확인: true
					}
				}
			}
		},

		{
			id: 'fire-missile',
			title: '목표 지점 공격',
			type: 'team-final',
			roleSuccessState: robotCockpitRoleSuccessStates.fireMissile,
			successState: robotCockpitMissionSuccessStates.fireMissile,
			simulationScope: 'room',
			finalSubmitMode: 'full',
			waitForFinalResultCallback: true,
			requireSameFinalSubmissions: true,
			finalMismatchMessage:
				'팀원들의 최종 공격 JSON이 서로 다릅니다. 회의 후 같은 명령을 다시 제출하세요.',

			initialJson: `{
  "목표조준": false,
  "미사일발사": false
}`,

			finalAnswer: {
				목표조준: true,
				미사일발사: true
			},

			roleMissions: {
				pilot: {
					story: {
						call: '조종 담당, 목표 지점을 조준하세요.',
						summary: '공격을 시작하려면 목표를 정확히 조준해야 합니다.',
						mission: '목표조준과 미사일발사를 true로 바꾸세요.'
					},
					role: {
						title: '조종 담당',
						icon: '🕹️',
						description: '최종 공격 명령을 입력하는 역할'
					},
					clues: [
						'목표를 조준하려면 "목표조준"은 true입니다.',
						'공격하려면 "미사일발사"는 true입니다.'
					],
					keyChips: ['목표조준', '미사일발사'],
					valueChips: ['true', 'false']
				},

				sensor: {
					story: {
						call: '센서 담당, 목표 좌표를 확인하세요.',
						summary: '센서가 목표 지점을 확인했습니다. 공격 명령을 완성해야 합니다.',
						mission: '목표조준과 미사일발사를 true로 바꾸세요.'
					},
					role: {
						title: '센서 담당',
						icon: '📡',
						description: '목표 확인을 담당하는 역할'
					},
					clues: [
						'목표 좌표가 확인되면 "목표조준"은 true입니다.',
						'공격 실행은 "미사일발사" true입니다.'
					],
					keyChips: ['목표조준', '미사일발사'],
					valueChips: ['true', 'false']
				},

				weapon: {
					story: {
						call: '무장 담당, 미사일 발사를 준비하세요.',
						summary: '목표가 확인되면 미사일을 발사할 수 있습니다.',
						mission: '목표조준과 미사일발사를 true로 바꾸세요.'
					},
					role: {
						title: '무장 담당',
						icon: '🚀',
						description: '미사일 발사를 담당하는 역할'
					},
					clues: [
						'미사일은 목표가 조준된 뒤 발사합니다.',
						'"목표조준"과 "미사일발사"는 모두 true입니다.'
					],
					keyChips: ['목표조준', '미사일발사'],
					valueChips: ['true', 'false']
				},

				engineer: {
					story: {
						call: '정비 담당, 발사 시스템을 확인하세요.',
						summary: '발사 시스템이 준비되었습니다. 최종 명령을 완성해야 합니다.',
						mission: '목표조준과 미사일발사를 true로 바꾸세요.'
					},
					role: {
						title: '정비 담당',
						icon: '🔧',
						description: '발사 시스템 확인을 담당하는 역할'
					},
					clues: [
						'발사 시스템이 준비되면 "목표조준"은 true입니다.',
						'발사를 실행하려면 "미사일발사"는 true입니다.'
					],
					keyChips: ['목표조준', '미사일발사'],
					valueChips: ['true', 'false']
				}
			},

			finalSuccessMessage: '목표 지점 공격 성공! 미사일이 정확히 명중했습니다.'
		}
	],

	completion: {
		badge: 'ROBOT MISSION COMPLETE',
		title: '로봇 콕핏 작전 완료!',
		subtitle: '팀의 JSON 명령으로 로봇을 조종하고 목표 지점을 공격했습니다.',
		summaryTitle: '최종 결과',
		summary: '콕핏 진입, HUD 전원, 미사일 발사까지 모든 단계가 완료되었습니다.',
		primaryButtonText: '홈으로'
	}
};
