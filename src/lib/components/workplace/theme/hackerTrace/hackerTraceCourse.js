// src/lib/components/workplace/theme/hackerTrace/hackerTraceCourse.js

export const hackerTraceCourse = {
	id: 'hackerTrace',
	title: '해커 추적대: 가짜 치킨파티 알림',
	subtitle: '흩어진 로그를 연결해 가짜 알림을 보낸 해커를 찾아보세요!',
	icon: '🕵️',
	themeId: 'hackerTrace',
	categoryId: 'read',
	categoryTitle: '제이슨 해석',
	mode: 'read',

	intro: {
		badge: 'SECURITY BRIEFING',
		title: '가짜 치킨파티 알림 해킹 사건!',
		subtitle: '전교생에게 수상한 급식 알림이 발송되었습니다.',
		image: '/images/themes/hacker/base.png',
		imageAlt: '보안 분석팀이 서버 로그를 확인하는 장면',
		summaryTitle: '현재 상황',
		summary:
			'학교 앱을 통해 전교생에게 “내일은 전교생 치킨파티입니다!”라는 가짜 알림이 발송되었습니다. 누군가 학교급식알림 계정을 해킹한 것 같습니다.',
		goalTitle: '우리의 임무',
		missionGoal:
			'각자 맡은 JSON 정보를 분석해 개인 단서를 만들고, 친구들의 단서와 연결해 어떤 아이디가 가짜 치킨파티 알림을 보냈는지 찾아내야 합니다.',
		steps: [
			'내 역할에 주어진 JSON 정보를 확인합니다.',
			'혼자 분석해서 개인 단서를 제출합니다.',
			'선생님의 승인을 받은 뒤 팀 협동 추리에 참여합니다.',
			'친구들의 단서와 내 단서를 연결해 사건 흐름을 완성합니다.',
			'팀 결론 JSON을 만들고 각자 역할 기준으로 검토 제출합니다.'
		],
		tip: '힌트: 알림을 보낸 계정 이름만 보고 범인을 단정하면 안 됩니다. 기기ID, 승인코드, 알림ID가 어떻게 이어지는지 함께 확인하세요.',
		buttonText: '해커 추적 시작하기'
	},

	roles: [
		{
			id: 'login',
			name: '민서',
			roleName: '로그인 기록 분석가',
			avatarSrc: '/images/avatars/1.png'
		},
		{
			id: 'location',
			name: '준호',
			roleName: '승인코드 분석가',
			avatarSrc: '/images/avatars/2.png'
		},
		{
			id: 'file',
			name: '서연',
			roleName: '알림 작성 분석가',
			avatarSrc: '/images/avatars/3.png'
		},
		{
			id: 'permission',
			name: '도윤',
			roleName: '알림 발송 분석가',
			avatarSrc: '/images/avatars/4.png'
		}
	],

	missions: [
		{
			id: 'personal-log-analysis',
			title: '개인 JSON 로그 분석',
			type: 'role-analysis',

			initialJson: `{
  "의심아이디": "",
  "이유": "",
  "더 필요한 정보": ""
}`,

			roleMissions: {
				login: {
					story: {
						title: '개인 JSON 로그 분석',
						call: '로그인 기록 분석가님, 누가 어떤 기기로 알림 관리 화면에 접속했는지 확인해 주세요.',
						summary:
							'로그인 기록에는 아이디, 접속 시간, 접속 화면, 기기ID가 남아 있습니다. 하지만 로그인 기록만으로는 최종 범인을 확정하기 어렵습니다.',
						mission:
							'로그인 기록에서 가장 수상한 아이디와 그 이유를 분석 결과 JSON으로 제출하세요.'
					},
					role: {
						title: '로그인 기록 분석가',
						icon: '🔐',
						description: '아이디별 접속 시간, 접속 화면, 기기ID를 분석하는 역할'
					},
					clues: [
						{
							type: 'json',
							title: '로그인 기록 JSON',
							data: {
								로그인기록: [
									{
										아이디: '파란새',
										시간: '12:35',
										접속화면: '학급 공지 보기',
										기기ID: 'D-11',
										결과: '성공',
										비고: '일반 조회'
									},
									{
										아이디: '초록여우',
										시간: '12:39',
										접속화면: '알림 관리 화면',
										기기ID: 'D-07',
										결과: '성공',
										비고: '가짜 알림 발송 전 접속'
									},
									{
										아이디: '붉은판다',
										시간: '12:41',
										접속화면: '알림 관리 화면',
										기기ID: 'D-12',
										결과: '성공',
										비고: '비슷한 시간에 접속해 수상해 보임'
									},
									{
										아이디: '노란토끼',
										시간: '12:46',
										접속화면: '학급 공지 보기',
										기기ID: 'D-15',
										결과: '성공',
										비고: '일반 조회'
									}
								]
							}
						}
					],
					keyChips: ['초록여우', '붉은판다', '알림 관리 화면', 'D-07', 'D-12']
				},

				location: {
					story: {
						title: '개인 JSON 로그 분석',
						call: '승인코드 분석가님, 어떤 승인코드가 어느 기기에서 사용되었는지 확인해 주세요.',
						summary:
							'승인코드 기록에는 권한을 얻기 위해 사용된 코드와 기기ID가 남아 있습니다. 어떤 기기에서 학교급식알림 발송 권한을 얻었는지 찾아야 합니다.',
						mission:
							'승인코드 사용 기록에서 가장 중요한 코드와 기기ID를 분석 결과 JSON으로 제출하세요.'
					},
					role: {
						title: '승인코드 분석가',
						icon: '🧩',
						description: '승인코드, 사용 시간, 사용 기기ID, 사용 목적을 분석하는 역할'
					},
					clues: [
						{
							type: 'json',
							title: '승인코드 사용 기록 JSON',
							data: {
								승인코드사용기록: [
									{
										코드: 'C-418',
										사용시간: '12:37',
										사용기기ID: 'D-11',
										사용목적: '학급 공지 수정',
										결과: '정상'
									},
									{
										코드: 'C-905',
										사용시간: '12:40',
										사용기기ID: 'D-07',
										사용목적: '학교급식알림 발송 권한',
										결과: '정상'
									},
									{
										코드: 'C-222',
										사용시간: '12:42',
										사용기기ID: 'D-12',
										사용목적: '운동장 예약 알림 확인',
										결과: '정상'
									}
								]
							}
						}
					],
					keyChips: ['C-905', '학교급식알림 발송 권한', 'D-07', '12:40']
				},

				file: {
					story: {
						title: '개인 JSON 로그 분석',
						call: '알림 작성 분석가님, 어떤 알림이 어느 기기에서 작성되었는지 확인해 주세요.',
						summary:
							'알림 작성 기록에는 알림ID, 작성 시간, 작성 계정, 제목, 내용, 작성 기기ID가 남아 있습니다. 가짜 치킨파티 알림이 어떤 기기에서 만들어졌는지 찾아야 합니다.',
						mission:
							'알림 작성 기록에서 가장 중요한 알림ID와 작성 기기ID를 분석 결과 JSON으로 제출하세요.'
					},
					role: {
						title: '알림 작성 분석가',
						icon: '📄',
						description: '알림ID, 작성 시간, 작성 계정, 내용, 작성 기기ID를 분석하는 역할'
					},
					clues: [
						{
							type: 'json',
							title: '알림 작성 기록 JSON',
							data: {
								알림작성기록: [
									{
										알림ID: 'MSG-101',
										작성시간: '12:38',
										작성계정: '학급공지알림',
										제목: '청소구역 안내',
										내용: '오늘 청소구역을 확인하세요.',
										작성기기ID: 'D-11',
										상태: '임시저장'
									},
									{
										알림ID: 'MSG-777',
										작성시간: '12:41',
										작성계정: '학교급식알림',
										제목: '내일 급식 변경 안내',
										내용: '내일은 전교생 치킨파티입니다!',
										작성기기ID: 'D-07',
										상태: '발송대기'
									},
									{
										알림ID: 'MSG-120',
										작성시간: '12:43',
										작성계정: '운동장예약알림',
										제목: '운동장 사용 안내',
										내용: '오늘 운동장 사용 가능 시간을 확인하세요.',
										작성기기ID: 'D-12',
										상태: '임시저장'
									}
								]
							}
						}
					],
					keyChips: ['MSG-777', '치킨파티', '학교급식알림', 'D-07']
				},

				permission: {
					story: {
						title: '개인 JSON 로그 분석',
						call: '알림 발송 분석가님, 어떤 알림이 실제로 발송되었는지 확인해 주세요.',
						summary:
							'알림 발송 기록에는 알림ID, 발송 시간, 받는 대상, 결과, 발송 기기ID가 남아 있습니다. 작성된 알림 중 실제로 전교생에게 발송된 알림을 찾아야 합니다.',
						mission:
							'알림 발송 기록에서 실제로 발송된 알림ID와 발송 기기ID를 분석 결과 JSON으로 제출하세요.'
					},
					role: {
						title: '알림 발송 분석가',
						icon: '📢',
						description: '알림ID, 발송 시간, 받는 대상, 발송 기기ID를 분석하는 역할'
					},
					sideClues: [
						'null은 내용이 없다는 뜻이에요',
						
					],
					clues: [
						{
							type: 'json',
							title: '알림 발송 기록 JSON',
							data: {
								알림발송기록: [
									{
										알림ID: 'MSG-101',
										발송시간: null,
										받는대상: '4학년 1반',
										결과: '발송 안 됨',
										발송기기ID: null
									},
									{
										알림ID: 'MSG-777',
										발송시간: '12:42',
										받는대상: '전교생',
										결과: '발송 완료',
										발송기기ID: 'D-07'
									},
									{
										알림ID: 'MSG-120',
										발송시간: null,
										받는대상: '축구부',
										결과: '발송 안 됨',
										발송기기ID: null
									}
								]
							}
						}
					],
					keyChips: ['MSG-777', '12:42', '전교생', '발송 완료', 'D-07']
				}
			}
		},

		{
			id: 'team-hacker-report',
			title: '협동 추론 보고서',
			type: 'team-json-report',

			initialJson: `{
  "범인아이디": "",
  "사건의흐름": [],
  "판단근거": ""
}`,

			roleMissions: {
				login: createTeamHackerReportRoleMission(
					'로그인 기록 분석 결과를 팀에 공유하세요. 어떤 아이디가 어떤 기기ID로 알림 관리 화면에 접속했는지 친구들의 단서와 연결해 보세요.'
				),
				location: createTeamHackerReportRoleMission(
					'승인코드 분석 결과를 팀에 공유하세요. 학교급식알림 발송 권한 코드가 어떤 기기ID에서 사용되었는지 확인하세요.'
				),
				file: createTeamHackerReportRoleMission(
					'알림 작성 분석 결과를 팀에 공유하세요. 가짜 치킨파티 알림이 어떤 알림ID이고 어느 기기에서 작성되었는지 확인하세요.'
				),
				permission: createTeamHackerReportRoleMission(
					'알림 발송 분석 결과를 팀에 공유하세요. 실제로 전교생에게 발송된 알림ID와 발송 기기ID를 확인하세요.'
				)
			}
		}
	]
};

function createTeamHackerReportRoleMission(call) {
	return {
		story: {
			title: '협동 추론 보고서',
			call,
			summary:
				'미션 1에서 승인받은 개인 분석 결과를 팀원들과 공유하고, 기기ID·승인코드·알림ID가 어떻게 이어지는지 함께 맞춰 보세요.',
			mission:
				'친구들의 단서를 모아 정답을 제출하세요. 대표로 1명이 제출하면 됩니다.'
		},
		role: {
			title: '협동 추론 보고서 작성',
			icon: '🧠',
			description: '친구들의 단서를 연결해 최종 해커 추적 보고서를 완성하는 역할'
		},
		clues: [
			{
				type: 'json',
				title: '보고서 작성 형식 예시 JSON',
				data: {
					작성예시: {
						범인아이디: '보라늑대',
						사건의흐름: [
							'보라늑대가 T-04 기기로 게시판 관리 화면에 접속했다',
							'T-04 기기에서 게시판 수정 승인코드 B-318이 사용되었다',
							'T-04 기기에서 POST-209 글이 작성되었다',
							'POST-209 글이 학급 전체에게 공개되었다'
						],
						판단근거:
							'게시글을 작성하고 공개한 기기ID가 모두 T-04이며, 로그인 기록에서 T-04를 사용한 아이디가 보라늑대이기 때문이다.'
					}
				}
			},
			{
				type: 'json',
				title: '작성 방법 힌트 JSON',
				data: {
					작성방법: {
						범인아이디: '가짜 알림을 보낸 것으로 가장 의심되는 아이디를 씁니다',
						사건의흐름: [
							'시간 순서대로 사건을 정리합니다',
							'서로 다른 로그에서 같은 값이 반복되는지 확인합니다',
							'알림이 작성되고 발송되기까지의 흐름을 연결합니다'
						],
						판단근거:
							'한 가지 로그만 보지 말고, 여러 로그에서 공통으로 이어지는 단서를 사용해 설명합니다'
					}
				}
			}
		],
		keyChips: ['범인아이디', '사건의흐름', '판단근거', 'D-07', 'MSG-777']
	};
}