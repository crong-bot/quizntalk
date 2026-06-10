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
	isRealData: false,
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
			simulationScope: 'local',
			initialJson: ``,

			roleMissions: {
				pilot: {
					story: {
						call: '조종 담당, 로봇에 탑승할 준비를 하세요.',
						summary: '멀리 보이는 로봇의 콕핏으로 진입해야 합니다.',
						mission: '파일럿 아이디와 코드를 입력하세요.'
					},
					role: {
						title: '조종 담당',
						icon: '🕹️',
						description: '로봇 탑승 명령을 입력하는 역할'
					},
					clues: [
						'로봇에 탑승하려면 "파일럿아이디"와 "코드"를 입력해야 합니다.',
						'"파일럿 ID"는 "25KE-415" 이고 코드는 31735 입니다.'
					],
					keyChips: ['파일럿아이디'],
					valueChips: ['true', 'false'],
					answer: {
						파일럿아이디: '25KE-415',
						코드: 31735
					}
				},

				sensor: {
					story: {
						call: '센서 담당, 콕핏 진입 상태를 확인하세요.',
						summary: '외부 화면에서 내부 조종석 화면으로 전환해야 합니다.',
						mission: '파일럿 아이디와 코드를 입력하세요.'
					},
					role: {
						title: '센서 담당',
						icon: '📡',
						description: '진입 신호를 확인하는 역할'
					},
					clues: [
						'로봇에 탑승하려면 "파일럿아이디"와 "코드"를 입력해야 합니다.',
						'"파일럿 ID"는 "25KE-415" 이고 코드는 31735 입니다.'
					],
					keyChips: ['파일럿아이디'],
					valueChips: ['true', 'false'],
					answer: {
						파일럿아이디: '25KE-415',
						코드: 31735
					}
				},

				weapon: {
					story: {
						call: '무장 담당, 콕핏 진입 명령을 동기화하세요.',
						summary: '무기 시스템을 쓰려면 먼저 조종석에 들어가야 합니다.',
						mission: '파일럿 아이디와 코드를 입력하세요.'
					},
					role: {
						title: '무장 담당',
						icon: '🚀',
						description: '무기 시스템 준비 전 진입을 확인하는 역할'
					},
					clues: [
						'로봇에 탑승하려면 "파일럿아이디"와 "코드"를 입력해야 합니다.',
						'"파일럿 ID"는 "25KE-415" 이고 코드는 31735 입니다.'
					],
					keyChips: ['파일럿아이디'],
					valueChips: ['true', 'false'],
					answer: {
						파일럿아이디: '25KE-415',
						코드: 31735
					}
				},

				engineer: {
					story: {
						call: '정비 담당, 내부 시스템 진입을 확인하세요.',
						summary: '로봇 내부 시스템에 접속해야 다음 단계를 진행할 수 있습니다.',
						mission: '파일럿 아이디와 코드를 입력하세요.'
					},
					role: {
						title: '정비 담당',
						icon: '🔧',
						description: '내부 시스템 진입을 담당하는 역할'
					},
					clues: [
						'로봇에 탑승하려면 "파일럿아이디"와 "코드"를 입력해야 합니다.',
						'"파일럿 ID"는 "25KE-415" 이고 코드는 31735 입니다.'
					],
					keyChips: ['파일럿아이디'],
					valueChips: ['true', 'false'],
					answer: {
						파일럿아이디: '25KE-415',
						코드: 31735
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
			simulationScope: 'local',
			initialJson: ``,

			roleMissions: {
				pilot: {
					story: {
						call: '조종 담당, HUD를 켜고 좌우 시야를 확인하세요.',
						summary: '콕핏 화면은 켜졌지만 HUD가 아직 꺼져 있습니다.',
						mission: 'HUD전원을 키고 시선을 움직이고 움직여보세요.'
					},
					role: {
						title: '조종 담당',
						icon: '🕹️',
						description: 'HUD와 시선 이동을 담당하는 역할'
					},
					clues: [
						'"HUD전원"은 true입니다',
						'"시선확인"은 오른쪽, 가운데, 왼쪽, 가운데 순서를 잘 지켜서 배열로 입력합니다.',
						'"이동"은 앞, 원위치, 뒤, 원위치 순서를 잘 지켜서 배열로 입력합니다.'
					],
					keyChips: ['HUD전원', '시선확인'],
					valueChips: ['true', 'false'],
					answer: {
						HUD전원: true,
						시선확인: ['오른쪽', '가운데', '왼쪽', '가운데'],
						이동: ['앞', '원위치', '뒤', '원위치']
					}
				},
				sensor: {
					story: {
						call: '센서 담당, 주변 감지 화면을 켜세요.',
						summary: '센서 HUD를 켜고 좌우 시야를 확인해야 합니다.',
						mission: 'HUD전원을 키고 시선을 움직이고 움직여보세요.'
					},
					role: {
						title: '센서 담당',
						icon: '📡',
						description: '주변 감지와 시야 확인을 담당하는 역할'
					},
					clues: [
						'"HUD전원"은 true입니다',
						'"시선확인"은 오른쪽, 가운데, 왼쪽, 가운데 순서를 잘 지켜서 배열로 입력합니다.',
						'"이동"은 앞, 원위치, 뒤, 원위치 순서를 잘 지켜서 배열로 입력합니다.'
					],
					keyChips: ['HUD전원', '시선확인'],
					valueChips: ['true', 'false'],
					answer: {
						HUD전원: true,
						시선확인: ['오른쪽', '가운데', '왼쪽', '가운데'],
						이동: ['앞', '원위치', '뒤', '원위치']
					}
				},

				weapon: {
					story: {
						call: '무장 담당, 조준 화면을 준비하세요.',
						summary: '조준하려면 HUD가 켜지고 시야 확인이 끝나야 합니다.',
						mission: 'HUD전원을 키고 시선을 움직이고 움직여보세요.'
					},
					role: {
						title: '무장 담당',
						icon: '🚀',
						description: '조준 화면 준비를 담당하는 역할'
					},
					clues: [
						'"HUD전원"은 true입니다',
						'"시선확인"은 오른쪽, 가운데, 왼쪽, 가운데 순서를 잘 지켜서 배열로 입력합니다.',
						'"이동"은 앞, 원위치, 뒤, 원위치 순서를 잘 지켜서 배열로 입력합니다.'
					],
					keyChips: ['HUD전원', '시선확인'],
					valueChips: ['true', 'false'],
					answer: {
						HUD전원: true,
						시선확인: ['오른쪽', '가운데', '왼쪽', '가운데'],
						이동: ['앞', '원위치', '뒤', '원위치']
					}
				},

				engineer: {
					story: {
						call: '정비 담당, 전원 상태를 안정화하세요.',
						summary: 'HUD 전원을 켜고 좌우 화면 움직임을 확인해야 합니다.',
						mission: 'HUD전원을 키고 시선을 움직이고 움직여보세요.'
					},
					role: {
						title: '정비 담당',
						icon: '🔧',
						description: 'HUD 전원 안정화를 담당하는 역할'
					},
					clues: [
						'"HUD전원"은 true입니다',
						'"시선확인"은 오른쪽, 가운데, 왼쪽, 가운데 순서를 잘 지켜서 배열로 입력합니다.',
						'"이동"은 앞, 원위치, 뒤, 원위치 순서를 잘 지켜서 배열로 입력합니다.'
					],
					keyChips: ['HUD전원', '시선확인'],
					valueChips: ['true', 'false'],
					answer: {
						HUD전원: true,
						시선확인: ['오른쪽', '가운데', '왼쪽', '가운데'],
						이동: ['앞', '원위치', '뒤', '원위치']
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
 "공격실행": {
   "목표": "",
   "좌표": "",
   "무기": "",
   "발사각도": 
  }
}`,

			finalAnswer: {
				공격실행: {
					목표: '붉은타워',
					좌표: 'B7',
					무기: '미사일',
					발사각도: 24
				}
			},

			roleMissions: {
				pilot: {
					story: {
						call: '조종 담당, 공격 목표를 확인하세요.',
						summary: '조종석 화면에 공격 목표와 좌표 앞부분이 표시되었습니다.',
						mission: '팀원들과 단서를 합쳐 최종 공격 JSON을 완성하세요.'
					},
					role: {
						title: '조종 담당',
						icon: '🕹️',
						description: '공격 목표와 좌표 앞부분을 확인하는 역할'
					},
					clues: [
						'"목표"는 "붉은타워"입니다.',
						'"좌표"는 알파벳과 숫자를 붙여 만듭니다.',
						'"좌표"의 알파벳은 B입니다.'
					],
					keyChips: ['공격실행', '목표', '좌표'],
					valueChips: ['"붉은타워"', '"B"']
				},

				sensor: {
					story: {
						call: '센서 담당, 좌표 숫자를 확인하세요.',
						summary: '센서 화면에 목표 위치 번호가 표시되었습니다.',
						mission: '좌표의 숫자 부분을 팀원에게 알려주세요.'
					},
					role: {
						title: '센서 담당',
						icon: '📡',
						description: '좌표 숫자를 확인하는 역할'
					},
					clues: ['"좌표"의 숫자는 7입니다.', '"좌표"는 알파벳과 숫자를 붙여 만듭니다.'],
					keyChips: ['공격실행', '좌표'],
					valueChips: ['7', '"B7"']
				},

				weapon: {
					story: {
						call: '무장 담당, 사용할 무기를 확인하세요.',
						summary: '무장 시스템에 사용 가능한 무기가 표시되었습니다.',
						mission: '사용할 무기를 팀원에게 알려주세요.'
					},
					role: {
						title: '무장 담당',
						icon: '🚀',
						description: '공격 무기를 확인하는 역할'
					},
					clues: [
						'사용할 무기는 "미사일"입니다.',
						'미사일의 발사각도는 정비 담당 화면에서 확인합니다.'
					],
					keyChips: ['공격실행', '무기'],
					valueChips: ['"미사일"']
				},

				engineer: {
					story: {
						call: '정비 담당, 발사각도를 확인하세요.',
						summary: '정비 시스템에 무기별 발사각도가 표시되었습니다.',
						mission: '사용할 무기에 맞는 발사각도를 팀원에게 알려주세요.'
					},
					role: {
						title: '정비 담당',
						icon: '🔧',
						description: '발사각도를 확인하는 역할'
					},
					clues: ['무기별 발사각도: 레이저는 12, 미사일은 24, 전자포는 36입니다.'],
					keyChips: ['공격실행', '발사각도'],
					valueChips: ['12', '24', '36']
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
