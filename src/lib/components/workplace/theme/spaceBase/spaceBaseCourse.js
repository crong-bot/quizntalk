// C:\quizntalk\src\lib\components\workplace\theme\spaceBase\spaceBaseCourse.js
import {
	spaceBaseMissionSuccessStates,
	spaceBaseRoleSuccessStates
} from './spaceBaseLayers';

export const moonBaseCourse = {
	id: 'moon-base',
	title: '달 기지 복구',
	subtitle: '달 기지의 꺼진 시스템을 JSON 명령으로 복구하세요.',
	icon: '🪐',
	themeId: 'spaceBase',

	roles: [
		{
			id: 'power',
			name: '민서',
			roleName: '전력',
			avatarSrc: '/images/avatars/1.png'
		},
		{
			id: 'oxygen',
			name: '준호',
			roleName: '산소',
			avatarSrc: '/images/avatars/2.png'
		},
		{
			id: 'communication',
			name: '서연',
			roleName: '통신',
			avatarSrc: '/images/avatars/3.png'
		},
		{
			id: 'rover',
			name: '도윤',
			roleName: '탐사로봇',
			avatarSrc: '/images/avatars/4.png'
		}
	],

	missions: [
		{
			id: 'connect',
			layerKey: 'connect',
			title: '기지 접속',
			type: 'individual',
			effectKey: 'screenOn',
			roleSuccessState: spaceBaseRoleSuccessStates.connect,
			successState: spaceBaseMissionSuccessStates.connect,
			simulationScope: 'local',
			initialJson: `{
  "기지번호": "",
  "접속코드": 0
}`,

			roleMissions: {
				power: {
					story: {
						call: '전력 담당 요원님, 들리나요?',
						summary: '달 기지 화면이 꺼져 있습니다. 먼저 전력 장치와 접속해야 합니다.',
						mission: '기지번호와 접속코드를 입력해 전력 장치를 연결하세요.'
					},
					role: {
						title: '전력 담당',
						icon: '⚡',
						description: '전력 장치 접속 정보를 확인하는 역할'
					},
					clues: ['기지번호는 "전력-01"입니다.', '접속코드는 숫자 1204입니다.'],
					keyChips: ['기지번호', '접속코드'],
					valueChips: ['"전력-01"', '1204'],
					answer: {
						기지번호: '전력-01',
						접속코드: 1204
					}
				},

				oxygen: {
					story: {
						call: '산소 담당 요원님, 접속을 시작하세요.',
						summary: '산소 장치의 응답 신호가 끊겨 있습니다.',
						mission: '기지번호와 접속코드를 입력해 산소 장치를 연결하세요.'
					},
					role: {
						title: '산소 담당',
						icon: 'O₂',
						description: '산소 장치 접속 정보를 확인하는 역할'
					},
					clues: ['기지번호는 "산소-01"입니다.', '접속코드는 숫자 2108입니다.'],
					keyChips: ['기지번호', '접속코드'],
					valueChips: ['"산소-01"', '2108'],
					answer: {
						기지번호: '산소-01',
						접속코드: 2108
					}
				},

				communication: {
					story: {
						call: '통신 담당 요원님, 신호를 확인하세요.',
						summary: '통신 장치가 관제센터와 연결되지 않았습니다.',
						mission: '기지번호와 접속코드를 입력해 통신 장치를 연결하세요.'
					},
					role: {
						title: '통신 담당',
						icon: '📡',
						description: '통신 장치 접속 정보를 확인하는 역할'
					},
					clues: ['기지번호는 "통신-01"입니다.', '접속코드는 숫자 3407입니다.'],
					keyChips: ['기지번호', '접속코드'],
					valueChips: ['"통신-01"', '3407'],
					answer: {
						기지번호: '통신-01',
						접속코드: 3407
					}
				},

				rover: {
					story: {
						call: '탐사로봇 담당 요원님, 로버 신호를 찾아주세요.',
						summary: '탐사로봇의 위치 신호가 확인되지 않습니다.',
						mission: '기지번호와 접속코드를 입력해 탐사로봇을 연결하세요.'
					},
					role: {
						title: '탐사로봇 담당',
						icon: '🤖',
						description: '탐사로봇 접속 정보를 확인하는 역할'
					},
					clues: ['기지번호는 "로버-01"입니다.', '접속코드는 숫자 5521입니다.'],
					keyChips: ['기지번호', '접속코드'],
					valueChips: ['"로버-01"', '5521'],
					answer: {
						기지번호: '로버-01',
						접속코드: 5521
					}
				}
			}
		},

		{
			id: 'power-link',
			layerKey: 'powerLink',
			title: '전원 연결',
			type: 'individual',
			effectKey: 'powerGlow',
			roleSuccessState: spaceBaseRoleSuccessStates.powerLink,
			successState: spaceBaseMissionSuccessStates.powerLink,
			simulationScope: 'room',
			initialJson: `{
  "장치": "",
  "연결": false,
  "전압": 0
}`,

			roleMissions: {
				power: {
					story: {
						call: '전력 담당 요원님, 전원 연결을 시작합니다.',
						summary: '기지와 접속했습니다. 이제 전력센터의 전원을 연결해야 합니다.',
						mission: '장치, 연결, 전압 값을 완성해 전력센터를 켜세요.'
					},
					role: {
						title: '전력 담당',
						icon: '⚡',
						description: '전력센터의 전원을 연결하는 역할'
					},
					clues: ['장치는 "전력센터"입니다.', '연결은 true입니다.', '전압은 숫자 220입니다.'],
					keyChips: ['장치', '연결', '전압'],
					valueChips: ['"전력센터"', 'true', '220'],
					answer: {
						장치: '전력센터',
						연결: true,
						전압: 220
					}
				},

				oxygen: {
					story: {
						call: '산소 담당 요원님, 산소 장치 전원을 연결하세요.',
						summary: '산소센터에 전력이 공급되어야 생명유지 장치를 준비할 수 있습니다.',
						mission: '장치, 연결, 전압 값을 완성해 산소센터를 켜세요.'
					},
					role: {
						title: '산소 담당',
						icon: 'O₂',
						description: '산소센터의 전원을 연결하는 역할'
					},
					clues: ['장치는 "산소센터"입니다.', '연결은 true입니다.', '전압은 숫자 110입니다.'],
					keyChips: ['장치', '연결', '전압'],
					valueChips: ['"산소센터"', 'true', '110'],
					answer: {
						장치: '산소센터',
						연결: true,
						전압: 110
					}
				},

				communication: {
					story: {
						call: '통신 담당 요원님, 안테나 전원을 연결하세요.',
						summary: '통신 안테나가 켜져야 관제센터와 연결할 수 있습니다.',
						mission: '장치, 연결, 전압 값을 완성해 통신안테나를 켜세요.'
					},
					role: {
						title: '통신 담당',
						icon: '📡',
						description: '통신안테나의 전원을 연결하는 역할'
					},
					clues: ['장치는 "통신안테나"입니다.', '연결은 true입니다.', '전압은 숫자 48입니다.'],
					keyChips: ['장치', '연결', '전압'],
					valueChips: ['"통신안테나"', 'true', '48'],
					answer: {
						장치: '통신안테나',
						연결: true,
						전압: 48
					}
				},

				rover: {
					story: {
						call: '탐사로봇 담당 요원님, 로버 전원을 연결하세요.',
						summary: '탐사로봇이 출발하려면 먼저 전원이 연결되어야 합니다.',
						mission: '장치, 연결, 전압 값을 완성해 탐사로봇을 켜세요.'
					},
					role: {
						title: '탐사로봇 담당',
						icon: '🤖',
						description: '탐사로봇의 전원을 연결하는 역할'
					},
					clues: ['장치는 "탐사로봇"입니다.', '연결은 true입니다.', '전압은 숫자 24입니다.'],
					keyChips: ['장치', '연결', '전압'],
					valueChips: ['"탐사로봇"', 'true', '24'],
					answer: {
						장치: '탐사로봇',
						연결: true,
						전압: 24
					}
				}
			}
		},

		{
			id: 'final-sync',
			layerKey: 'finalSync',
			title: '최종 시스템 동기화',
			type: 'team-final',
			effectKey: 'systemOnline',
			roleSuccessState: spaceBaseRoleSuccessStates.finalSync,
			successState: spaceBaseMissionSuccessStates.finalSync,
			simulationScope: 'room',
			initialJson: `{
  "전력": 0,
  "산소": false,
  "통신코드": "",
  "탐사로봇": false
}`,

			finalAnswer: {
				전력: 100,
				산소: true,
				통신코드: 'AD32',
				탐사로봇: true
			},

			roleMissions: {
				power: {
					story: {
						call: '전력 담당 요원님, 마지막 동기화 값이 필요합니다.',
						summary: '기지의 최종 시스템을 온라인 상태로 전환해야 합니다.',
						mission: '최종 JSON에서 전력 값을 완성해 제출하세요.'
					},
					role: {
						title: '전력 담당',
						icon: '⚡',
						description: '최종 JSON의 전력 값을 맡는 역할'
					},
					clues: ['전력 값은 숫자 100입니다.'],
					keyChips: ['전력', '산소', '통신코드', '탐사로봇'],
					valueChips: ['100'],
					finalPiece: {
						key: '전력',
						value: 100
					}
				},

				oxygen: {
					story: {
						call: '산소 담당 요원님, 생명유지 값을 제출하세요.',
						summary: '기지의 최종 시스템을 온라인 상태로 전환해야 합니다.',
						mission: '최종 JSON에서 산소 값을 완성해 제출하세요.'
					},
					role: {
						title: '산소 담당',
						icon: 'O₂',
						description: '최종 JSON의 산소 값을 맡는 역할'
					},
					clues: ['산소 값은 true입니다.'],
					keyChips: ['전력', '산소', '통신코드', '탐사로봇'],
					valueChips: ['true'],
					finalPiece: {
						key: '산소',
						value: true
					}
				},

				communication: {
					story: {
						call: '통신 담당 요원님, 통신코드를 제출하세요.',
						summary: '기지의 최종 시스템을 온라인 상태로 전환해야 합니다.',
						mission: '최종 JSON에서 통신코드 값을 완성해 제출하세요.'
					},
					role: {
						title: '통신 담당',
						icon: '📡',
						description: '최종 JSON의 통신코드를 맡는 역할'
					},
					clues: ['통신코드 값은 "AD32"입니다.'],
					keyChips: ['전력', '산소', '통신코드', '탐사로봇'],
					valueChips: ['"AD32"'],
					finalPiece: {
						key: '통신코드',
						value: 'AD32'
					}
				},

				rover: {
					story: {
						call: '탐사로봇 담당 요원님, 로버 준비 값을 제출하세요.',
						summary: '기지의 최종 시스템을 온라인 상태로 전환해야 합니다.',
						mission: '최종 JSON에서 탐사로봇 값을 완성해 제출하세요.'
					},
					role: {
						title: '탐사로봇 담당',
						icon: '🤖',
						description: '최종 JSON의 탐사로봇 값을 맡는 역할'
					},
					clues: ['탐사로봇 값은 true입니다.'],
					keyChips: ['전력', '산소', '통신코드', '탐사로봇'],
					valueChips: ['true'],
					finalPiece: {
						key: '탐사로봇',
						value: true
					}
				}
			},
			// finalSequenceLayers: {
			// 	finalSequence: true,
			// 	energyLines: true,
			// 	basePulse: true,
			// 	baseOnline: true,
			// 	systemOnline: false
			// },
			finalSuccessMessage: '작전 성공! 팀의 JSON 값이 하나로 합쳐졌습니다.'
		}
	]
};
