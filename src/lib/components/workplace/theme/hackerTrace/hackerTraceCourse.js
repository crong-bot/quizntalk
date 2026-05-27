// src/lib/components/workplace/theme/hackerTrace/hackerTraceCourse.js

export const hackerTraceCourse = {
	id: 'hackerTrace',
	title: '해커 추적대: 사라진 학생정보.json',
	subtitle: '흩어진 로그를 연결해 진짜 의심 아이디를 찾아보세요!',
	icon: '🕵️',
	themeId: 'hackerTrace',
	categoryId: 'read',
	categoryTitle: '제이슨 해석',
	mode: 'read',

	intro: {
		badge: 'SECURITY BRIEFING',
		title: '학교 서버 긴급 보안 분석',
		subtitle: '학생정보.json 파일이 수상하게 수정되었습니다.',
		image: '/images/themes/hacker/intro.png',
		imageAlt: '보안 분석팀이 서버 로그를 확인하는 장면',
		summaryTitle: '현재 상황',
		summary:
			'학교 서버의 학생정보.json 파일이 몰래 수정되었습니다. 하지만 로그인 기록, 접속 위치, 파일 변경 기록, 권한 변경 기록이 서로 나뉘어 있어 혼자서는 진짜 흐름을 알 수 없습니다.',
		goalTitle: '우리의 임무',
		missionGoal:
			'각자 맡은 JSON 로그를 분석해 개인 단서를 만들고, 친구들의 단서와 연결해 실제로 어떤 아이디가 의심스러운지 추론해야 합니다.',
		steps: [
			'내 역할에 주어진 JSON 로그를 확인합니다.',
			'혼자 분석해서 개인 단서를 제출합니다.',
			'교사 승인을 받은 뒤 팀 협동 추론에 참여합니다.',
			'친구들의 단서와 내 단서를 연결해 사건 흐름을 완성합니다.',
			'팀 결론 JSON을 만들고 각자 역할 기준으로 검토 제출합니다.'
		],
		tip: '힌트: 파일을 직접 수정한 아이디가 곧바로 진짜 범인이라고 단정하면 안 됩니다. 권한을 누가 바꾸었는지, 시간 흐름이 어떻게 이어지는지 함께 확인하세요.',
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
			roleName: '접속 위치 분석가',
			avatarSrc: '/images/avatars/2.png'
		},
		{
			id: 'file',
			name: '서연',
			roleName: '파일 변경 분석가',
			avatarSrc: '/images/avatars/3.png'
		},
		{
			id: 'permission',
			name: '도윤',
			roleName: '권한 변경 분석가',
			avatarSrc: '/images/avatars/4.png'
		}
	],

	missions: [
		{
			id: 'personal-log-analysis',
			title: '개인 JSON 로그 분석',
			type: 'role-analysis',

			initialJson: `{
  "분석결과": "",
  "의심아이디": "",
  "근거": "",
  "혼자판단의한계": ""
}`,

			roleMissions: {
				login: {
					story: {
						title: '개인 JSON 로그 분석',
						call: '로그인 기록 분석가님, 누가 언제 접속했는지 확인해 주세요.',
						summary:
							'로그인 성공 여부와 실패 횟수를 보고 수상한 아이디를 찾아야 합니다. 하지만 로그인 기록만으로는 최종 의심 아이디를 확정할 수 없습니다.',
						mission: '로그인 기록에서 가장 수상한 아이디와 그 이유를 분석 결과 JSON으로 제출하세요.'
					},
					role: {
						title: '로그인 기록 분석가',
						icon: '🔐',
						description: '아이디별 로그인 시간, 성공 여부, 실패 횟수를 분석하는 역할'
					},
					clues: [
						{
							type: 'json',
							title: '로그인 기록 JSON',
							data: {
								로그인기록: [
									{
										아이디: '파란새',
										시간: '12:47',
										성공: true,
										실패횟수: 0,
										비고: '평소 접속 기록과 비슷함'
									},
									{
										아이디: '초록여우',
										시간: '12:52',
										성공: true,
										실패횟수: 2,
										비고: '비밀번호 실패 후 로그인 성공'
									},
									{
										아이디: '은빛고양이',
										시간: '12:55',
										성공: true,
										실패횟수: 0,
										비고: '자동 작업 계정으로 표시됨'
									},
									{
										아이디: '붉은판다',
										시간: '13:03',
										성공: false,
										실패횟수: 1,
										비고: '로그인 실패 후 접속 없음'
									}
								]
							}
						}
					],
					keyChips: ['초록여우', '12:52', '실패횟수 2', '혼자판단의한계']
				},

				location: {
					story: {
						title: '개인 JSON 로그 분석',
						call: '접속 위치 분석가님, 아이디들이 어디에서 접속했는지 확인해 주세요.',
						summary:
							'평소 접속 위치와 실제 접속 위치를 비교해야 합니다. 위치 기록만 보면 다른 아이디가 더 의심스러워 보일 수도 있습니다.',
						mission:
							'접속 위치 기록에서 가장 수상한 아이디와 그 이유를 분석 결과 JSON으로 제출하세요.'
					},
					role: {
						title: '접속 위치 분석가',
						icon: '🌐',
						description: '아이디별 접속 위치와 평소 접속 위치를 비교하는 역할'
					},
					clues: [
						{
							type: 'json',
							title: '접속 위치 JSON',
							data: {
								접속위치: [
									{
										아이디: '파란새',
										지역: '학교 내부',
										평소지역: '학교 내부',
										위험도: '낮음'
									},
									{
										아이디: '초록여우',
										지역: '학교 내부',
										평소지역: '학교 내부',
										위험도: '낮음'
									},
									{
										아이디: '은빛고양이',
										지역: '외부 IP',
										평소지역: '학교 내부',
										위험도: '높음'
									},
									{
										아이디: '붉은판다',
										지역: '학교 내부',
										평소지역: '학교 내부',
										위험도: '낮음'
									}
								]
							}
						}
					],
					keyChips: ['은빛고양이', '외부 IP', '평소지역 학교 내부', '혼자판단의한계']
				},

				file: {
					story: {
						title: '개인 JSON 로그 분석',
						call: '파일 변경 분석가님, 어떤 파일이 언제 수정되었는지 확인해 주세요.',
						summary:
							'파일 변경 기록에는 실제로 수정된 파일과 수정 아이디가 남아 있습니다. 하지만 이 아이디가 스스로 수정했는지, 누군가 이용했는지는 다른 로그가 필요합니다.',
						mission:
							'파일 변경 기록에서 가장 중요한 수정 내역과 의심 아이디를 분석 결과 JSON으로 제출하세요.'
					},
					role: {
						title: '파일 변경 분석가',
						icon: '📄',
						description: '파일명, 변경 시간, 수정 아이디, 중요도를 분석하는 역할'
					},
					clues: [
						{
							type: 'json',
							title: '파일 변경 기록 JSON',
							data: {
								파일변경기록: [
									{
										파일: '급식표.json',
										변경시간: '12:49',
										수정아이디: '파란새',
										중요도: '낮음'
									},
									{
										파일: '학생정보.json',
										변경시간: '12:56',
										수정아이디: '은빛고양이',
										중요도: '높음'
									},
									{
										파일: '공지사항.json',
										변경시간: '12:58',
										수정아이디: '초록여우',
										중요도: '보통'
									},
									{
										파일: '운동장예약.json',
										변경시간: '13:04',
										수정아이디: '붉은판다',
										중요도: '낮음'
									}
								]
							}
						}
					],
					keyChips: ['학생정보.json', '12:56', '은빛고양이', '혼자판단의한계']
				},

				permission: {
					story: {
						title: '개인 JSON 로그 분석',
						call: '권한 변경 분석가님, 누가 어떤 아이디의 권한을 바꾸었는지 확인해 주세요.',
						summary:
							'권한 변경 기록은 겉으로 보이는 수정 아이디 뒤에 숨은 흐름을 찾는 데 중요합니다. 권한이 언제 생기고 사라졌는지 확인하세요.',
						mission:
							'권한 변경 기록에서 가장 수상한 아이디와 그 이유를 분석 결과 JSON으로 제출하세요.'
					},
					role: {
						title: '권한 변경 분석가',
						icon: '🧩',
						description: '권한을 변경한 아이디, 대상 아이디, 변경 시각을 분석하는 역할'
					},
					clues: [
						{
							type: 'json',
							title: '권한 변경 기록 JSON',
							data: {
								권한변경기록: [
									{
										시간: '12:53',
										변경한아이디: '초록여우',
										대상아이디: '은빛고양이',
										변경내용: '학생정보.json 수정 권한 임시 부여'
									},
									{
										시간: '12:57',
										변경한아이디: '초록여우',
										대상아이디: '은빛고양이',
										변경내용: '학생정보.json 수정 권한 회수'
									},
									{
										시간: '13:05',
										변경한아이디: '파란새',
										대상아이디: '붉은판다',
										변경내용: '운동장예약.json 읽기 권한 부여'
									}
								]
							}
						}
					],
					keyChips: ['초록여우', '은빛고양이', '권한 임시 부여', '권한 회수']
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
					'로그인 기록 분석 결과를 팀에 공유하세요. 어떤 아이디가 언제 로그인했는지 친구들의 단서와 연결해 보세요.'
				),
				location: createTeamHackerReportRoleMission(
					'접속 위치 분석 결과를 팀에 공유하세요. 평소와 다른 위치에서 접속한 아이디가 사건 흐름과 어떻게 연결되는지 확인하세요.'
				),
				file: createTeamHackerReportRoleMission(
					'파일 변경 분석 결과를 팀에 공유하세요. 중요한 파일을 수정한 아이디가 진짜 범인인지, 다른 아이디에게 이용된 것인지 확인하세요.'
				),
				permission: createTeamHackerReportRoleMission(
					'권한 변경 분석 결과를 팀에 공유하세요. 누가 누구에게 권한을 주었는지 사건 흐름 속에서 확인하세요.'
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
				'미션 1에서 승인받은 개인 분석 결과를 팀원들과 공유하고, 사건이 일어난 순서를 함께 맞춰 보세요.',
			mission:
				'친구들의 단서를 모아 사건이 일어난 순서를 정리하고, 가장 의심되는 아이디와 판단근거를 JSON으로 작성하세요.'
		},
		role: {
			title: '협동 추론 보고서 작성',
			icon: '🧠',
			description: '친구들의 단서를 연결해 최종 해커 추적 보고서를 완성하는 역할'
		},
		clues: [
			{
				type: 'json',
				title: '다른 사건의 작성 예시 JSON',
				data: {
					작성예시: {
						범인아이디: '노란토끼',
						사건의흐름: [
							'노란토끼가 09:10에 로그인했다',
							'노란토끼가 하늘고래에게 파일 수정 권한을 주었다',
							'하늘고래가 행사명단.json을 수정했다',
							'노란토끼가 하늘고래의 권한을 다시 회수했다'
						],
						판단근거:
							'하늘고래가 파일을 수정한 것처럼 보이지만, 수정 전후로 노란토끼가 권한을 주고 회수했기 때문이다.'
					}
				}
			},
			{
				type: 'json',
				title: '작성 방법 힌트 JSON',
				data: {
					작성방법: {
						범인아이디: '가장 의심되는 아이디를 씁니다',
						사건의흐름: [
							'첫 번째로 일어난 일을 씁니다',
							'두 번째로 일어난 일을 씁니다',
							'세 번째로 일어난 일을 씁니다'
						],
						판단근거: '왜 그 아이디가 가장 의심되는지 한 문장으로 씁니다'
					}
				}
			}
		],
		keyChips: ['범인아이디', '사건의흐름', '판단근거']
	};
}
