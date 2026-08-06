// src/lib/features/mission-room/missionRoomService.js

import { getCourseByThemeId } from '$lib/components/workplace/theme/courseRegistry';
import {
	approveIndividualWriteSubmission,
	approveReadMissionSubmission,
	createIndividualWriteLessonRoom,
	createLessonWithRooms,
	deleteLessonCompletely,
	getRoomByInviteCode,
	joinIndividualWriteRoom,
	joinRoom,
	leaveIndividualWriteRoom,
	rejectIndividualWriteSubmission,
	rejectReadMissionSubmission,
	resetRoomParticipantsProgress,
	updateRoomState
} from './missionRoomRepository';

export async function createIndividualWriteSession({
	ownerUid,
	title,
	description,
	notes = [],
	exampleCode = '',
	maxParticipants = 40
}) {
	if (!ownerUid) {
		throw new Error('교사 로그인 후 사용할 수 있습니다.');
	}

	return createIndividualWriteLessonRoom({
		ownerUid,
		title,
		description,
		notes,
		exampleCode,
		maxParticipants
	});
}
export async function leaveIndividualWriteRoomByParticipant({ lessonId, roomId, participantId }) {
	return leaveIndividualWriteRoom({
		lessonId,
		roomId,
		participantId
	});
}

export function normalizeInviteCode(value) {
	return value.trim().toUpperCase().replace(/\s+/g, '');
}

export function createLocalParticipantId(roomCode) {
	const key = `participant_id_${roomCode}`;
	const saved = localStorage.getItem(key);

	if (saved) return saved;

	const nextId = `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
	localStorage.setItem(key, nextId);

	return nextId;
}

export function getLocalParticipantId(roomCode) {
	return localStorage.getItem(`participant_id_${roomCode}`) ?? '';
}

export function saveLocalParticipantName(roomCode, name) {
	localStorage.setItem(`participant_name_${roomCode}`, name.trim());
}

export function getLocalParticipantName(roomCode) {
	return localStorage.getItem(`participant_name_${roomCode}`) ?? '';
}

export async function createClassroomSession({
	ownerUid,
	selectedTheme,
	roomCount,
	roomCapacities
}) {
	if (!ownerUid) {
		throw new Error('교사 로그인 후 사용할 수 있습니다.');
	}

	if (!selectedTheme) {
		throw new Error('미션 테마를 선택하세요.');
	}

	const course = getCourseByThemeId(selectedTheme.id);
	const roles = course?.roles ?? [];
	const initialThemeState = course?.initialThemeState ?? {};

	return createLessonWithRooms({
		ownerUid,
		themeId: selectedTheme.id,
		themeTitle: selectedTheme.title,
		categoryId: selectedTheme.categoryId,
		categoryTitle: selectedTheme.categoryTitle,
		roomCount,
		roomCapacities,
		roles,
		initialThemeState
	});
}
export async function joinRoomByCode({ code, name, avatarNumber = 1 }) {
	const safeAvatarNumber = Math.max(1, Math.min(Number(avatarNumber) || 1, 6));

	const normalizedCode = normalizeInviteCode(code);
	const studentName = name.trim();

	if (!normalizedCode) {
		throw new Error('게임 코드를 입력하세요.');
	}

	if (!studentName) {
		throw new Error('이름을 입력하세요.');
	}

	const roomResult = await getRoomByInviteCode(normalizedCode);
	const participantId = createLocalParticipantId(normalizedCode);

	saveLocalParticipantName(normalizedCode, studentName);

	const isIndividualWriteRoom =
		roomResult.invite?.missionType === 'individual-write' ||
		roomResult.room?.missionType === 'individual-write' ||
		roomResult.lesson?.missionType === 'individual-write';

	if (isIndividualWriteRoom) {
		await joinIndividualWriteRoom({
			lessonId: roomResult.lessonId,
			roomId: roomResult.roomId,
			participantId,
			name: studentName,
			avatarNumber: safeAvatarNumber
		});

		return {
			...roomResult,
			participantId,
			participantName: studentName,
			avatarNumber: safeAvatarNumber,
			missionType: 'individual-write'
		};
	}

	const course = getCourseByThemeId(roomResult.room.themeId);
	const roles = course?.roles ?? [];
	const missionCount = course?.missions?.length ?? 3;

	const joinResult = await joinRoom({
		lessonId: roomResult.lessonId,
		roomId: roomResult.roomId,
		participantId,
		name: studentName,
		avatarNumber: safeAvatarNumber,
		roles,
		missionCount
	});

	return {
		...roomResult,
		participantId,
		participantName: studentName,
		roleName: joinResult.roleName,
		avatarNumber: joinResult.avatarNumber
	};
}

export function buildRoomSummary(room) {
	const participantCount = room.participantCount ?? 0;
	const missionNumber = (room.currentMissionIndex ?? 0) + 1;
	const maxParticipants = room.maxParticipants ?? 4;

	if (room.status === 'completed') {
		return {
			label: '완료',
			detail: '최종 미션까지 완료했습니다.',
			tone: 'emerald'
		};
	}

	if (participantCount === 0) {
		return {
			label: '대기중',
			detail: '아직 입장한 학생이 없습니다.',
			tone: 'slate'
		};
	}

	if (room.status === 'waiting') {
		return {
			label: '입장중',
			detail: `${participantCount}/${maxParticipants}명 입장`,
			tone: 'blue'
		};
	}

	if (room.reviewStatus === 'pending') {
		return {
			label: '교사 확인 대기',
			detail: '학생 제출물을 확인하고 승인 또는 반려하세요.',
			tone: 'violet'
		};
	}

	if (room.status === 'final') {
		return {
			label: '최종 미션 진행중',
			detail: '최종 제출을 기다리는 중입니다.',
			tone: 'violet'
		};
	}

	return {
		label: `미션 ${missionNumber} 진행중`,
		detail: `현재 미션 ${missionNumber}을 진행 중입니다.`,
		tone: 'amber'
	};
}

export function getRoomToneClass(tone) {
	if (tone === 'emerald') {
		return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
	}

	if (tone === 'blue') {
		return 'bg-blue-50 text-blue-700 ring-blue-100';
	}

	if (tone === 'violet') {
		return 'bg-violet-50 text-violet-700 ring-violet-100';
	}

	if (tone === 'amber') {
		return 'bg-amber-50 text-amber-700 ring-amber-100';
	}

	return 'bg-slate-100 text-slate-600 ring-slate-200';
}

export async function deleteClassroomSession({ lessonId }) {
	if (!lessonId) {
		throw new Error('삭제할 수업 정보가 없습니다.');
	}

	await deleteLessonCompletely({ lessonId });
}

/* -------------------------------------------------------------------------- */
/* 읽기 미션 제출 / 교사 승인 / 반려                                            */
/* -------------------------------------------------------------------------- */

export function isReadMissionCourse(course) {
	return course?.categoryId === 'read' || course?.mode === 'read';
}

export function isReadMission(mission) {
	return mission?.type === 'role-analysis' || mission?.type === 'team-json-report';
}

export function getReadMissionReviewKey({ mission, roleId }) {
	if (mission?.type === 'team-json-report') return 'team';
	return roleId;
}

export function getReviewItemsForRoom({ room, mission }) {
	const reviewMap = room?.pendingReviews?.[mission?.id] ?? {};

	return Object.entries(reviewMap).map(([key, review]) => ({
		key,
		...review
	}));
}

function normalizeMissionProgress(progress, missionCount) {
	if (Array.isArray(progress)) {
		return Array.from({ length: missionCount }, (_, index) => {
			return progress[index] ?? (index === 0 ? 'playing' : 'locked');
		});
	}

	return Array.from({ length: missionCount }, (_, index) => (index === 0 ? 'playing' : 'locked'));
}

function buildApprovedMissionProgress({ progress, missionIndex, missionCount }) {
	const next = normalizeMissionProgress(progress, missionCount);
	const isLastMission = missionIndex >= missionCount - 1;

	next[missionIndex] = 'cleared';

	if (!isLastMission) {
		next[missionIndex + 1] = 'playing';
	}

	return next;
}

function getExpectedReviewKeys({ course, room, mission }) {
	if (mission?.type === 'team-json-report') {
		return ['team'];
	}

	const maxParticipants = room?.maxParticipants ?? 4;

	return course?.roles?.slice(0, maxParticipants).map((role) => role.id) ?? [];
}

function willAllReviewsBeApproved({ room, mission, reviewKey, course }) {
	const reviewMap = room?.pendingReviews?.[mission?.id] ?? {};
	const expectedKeys = getExpectedReviewKeys({ course, room, mission });

	return expectedKeys.every((key) => {
		if (key === reviewKey) return true;
		return reviewMap?.[key]?.status === 'approved';
	});
}

function createMissionCompletedEvent({ mission, missionIndex, nextMissionIndex, status }) {
	const isCompleted = status === 'completed';

	return {
		type: 'mission_completed',
		missionId: mission?.id ?? '',
		missionTitle: mission?.title ?? `미션 ${missionIndex + 1}`,
		missionIndex,
		nextMissionIndex,
		status,
		message: isCompleted
			? '모든 미션이 완료되었습니다.'
			: `${mission?.title ?? `미션 ${missionIndex + 1}`}이 완료되었습니다.`,
		version: Date.now(),
		createdAt: new Date().toISOString()
	};
}

export async function submitReadMissionForReview({
	lessonId,
	roomId,
	mission,
	missionIndex,
	participantId,
	participantName,
	roleId,
	roleName,
	jsonText,
	missionProgress = []
}) {
	if (!lessonId || !roomId) {
		throw new Error('방 정보가 없습니다.');
	}

	if (!participantId) {
		throw new Error('참가자 정보가 없습니다.');
	}

	if (!isReadMission(mission)) {
		throw new Error('읽기 미션이 아닙니다.');
	}

	const reviewKey = getReadMissionReviewKey({ mission, roleId });

	if (!reviewKey) {
		throw new Error('제출 역할 정보가 없습니다.');
	}

	const reviewData = {
		type: mission.type,
		missionId: mission.id,
		missionTitle: mission.title ?? '',
		missionIndex,
		participantId,
		participantName: participantName ?? '',
		roleId: roleId ?? '',
		roleName: roleName ?? '',
		jsonText,
		missionProgress,
		status: 'pending',
		submittedAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	};

	await updateRoomState({
		lessonId,
		roomId,
		patch: {
			[`pendingReviews.${mission.id}.${reviewKey}`]: reviewData,
			reviewStatus: 'pending'
		}
	});

	return {
		ok: true,
		reviewKey,
		reviewData
	};
}

export async function approveReadMissionForRoom({
	lessonId,
	room,
	course,
	missionIndex,
	reviewKey,
	approveMessage = ''
}) {
	const mission = course?.missions?.[missionIndex];

	if (!lessonId) {
		throw new Error('수업 정보가 없습니다.');
	}

	if (!room?.id) {
		throw new Error('방 정보가 없습니다.');
	}

	if (!mission) {
		throw new Error('승인할 미션 정보를 찾을 수 없습니다.');
	}

	if (!isReadMission(mission)) {
		throw new Error('읽기 미션이 아닙니다.');
	}

	const review = room?.pendingReviews?.[mission.id]?.[reviewKey];

	if (!review) {
		throw new Error('승인할 제출물이 없습니다.');
	}

	const missionCount = course?.missions?.length ?? 1;
	const isLastMission = missionIndex >= missionCount - 1;

	const nextMissionProgress = buildApprovedMissionProgress({
		progress: review.missionProgress ?? [],
		missionIndex,
		missionCount
	});

	const allApproved = willAllReviewsBeApproved({
		room,
		mission,
		reviewKey,
		course
	});

	const reviewedAt = new Date().toISOString();

	const roomPatch = {
		[`pendingReviews.${mission.id}.${reviewKey}.status`]: 'approved',
		[`pendingReviews.${mission.id}.${reviewKey}.approveMessage`]:
			approveMessage || '좋아요. 분석 결과가 승인되었습니다.',
		[`pendingReviews.${mission.id}.${reviewKey}.reviewedAt`]: reviewedAt
	};

	if (allApproved) {
		if (mission.type === 'team-json-report' || isLastMission) {
			roomPatch.status = 'completed';
			roomPatch.currentMissionIndex = missionIndex;
			roomPatch.completedAt = reviewedAt;
		} else {
			roomPatch.status = 'playing';
			roomPatch.currentMissionIndex = missionIndex + 1;
		}

		roomPatch.reviewStatus = 'approved';

		roomPatch.lastMissionEvent = createMissionCompletedEvent({
			mission,
			missionIndex,
			nextMissionIndex: roomPatch.currentMissionIndex,
			status: roomPatch.status
		});
	}

	await approveReadMissionSubmission({
		lessonId,
		roomId: room.id,
		missionId: mission.id,
		reviewKey,
		participantId: review.participantId,
		missionProgress: nextMissionProgress,
		roomPatch
	});

	return {
		ok: true,
		allApproved
	};
}

export async function rejectReadMissionForRoom({
	lessonId,
	room,
	course,
	missionIndex,
	reviewKey,
	reason = ''
}) {
	const mission = course?.missions?.[missionIndex];

	if (!lessonId) {
		throw new Error('수업 정보가 없습니다.');
	}

	if (!room?.id) {
		throw new Error('방 정보가 없습니다.');
	}

	if (!mission) {
		throw new Error('반려할 미션 정보를 찾을 수 없습니다.');
	}

	if (!isReadMission(mission)) {
		throw new Error('읽기 미션이 아닙니다.');
	}

	await rejectReadMissionSubmission({
		lessonId,
		roomId: room.id,
		missionId: mission.id,
		reviewKey,
		reason
	});

	return {
		ok: true
	};
}
/* -------------------------------------------------------------------------- */
/* 교사용 방 재시작                                                            */
/* -------------------------------------------------------------------------- */

function buildRestartMissionProgress(missionCount) {
	return Array.from({ length: missionCount }, (_, index) => {
		return index === 0 ? 'playing' : 'locked';
	});
}

function buildRestartedParticipants({ room, missionCount }) {
	const initialMissionProgress = buildRestartMissionProgress(missionCount);

	if (Array.isArray(room?.participants)) {
		return room.participants.map((participant) => ({
			...participant,
			missionProgress: [...initialMissionProgress],
			currentMissionIndex: 0,
			status: 'playing'
		}));
	}

	if (room?.participants && typeof room.participants === 'object') {
		return Object.fromEntries(
			Object.entries(room.participants).map(([key, participant]) => [
				key,
				{
					...participant,
					missionProgress: [...initialMissionProgress],
					currentMissionIndex: 0,
					status: 'playing'
				}
			])
		);
	}

	return room?.participants ?? [];
}
function buildRestartedParticipantSummaries(room) {
	if (!room?.participantSummaries || typeof room.participantSummaries !== 'object') {
		return {};
	}

	return Object.fromEntries(
		Object.entries(room.participantSummaries).map(([participantId, summary]) => [
			participantId,
			{
				...summary,
				status: 'playing'
			}
		])
	);
}

export async function restartRoomForTeacher({ lessonId, room, course }) {
	if (!lessonId) {
		throw new Error('수업 정보가 없습니다.');
	}

	if (!room?.id) {
		throw new Error('방 정보가 없습니다.');
	}

	const missionCount = course?.missions?.length ?? 1;
	const restartedAt = new Date().toISOString();
	const restartVersion = Date.now();

	await resetRoomParticipantsProgress({
		lessonId,
		roomId: room.id,
		missionCount
	});

	await updateRoomState({
		lessonId,
		roomId: room.id,
		patch: {
			status: 'playing',
			currentMissionIndex: 0,
			verificationEnergy: 5,

			simulationState: {
				layers: {},
				sprites: {},
				camera: {},
				flags: {}
			},

			finalSubmissions: {},

			themeState: course?.initialThemeState ?? {},
			themeResult: null,

			finalExecutionStatus: null,
			finalExecutionStartedAt: null,
			finalExecutionCompletedAt: null,
			finalExecutionStartedBy: null,

			pendingReviews: {},
			reviewStatus: null,

			participantSummaries: buildRestartedParticipantSummaries(room),

			restartVersion,
			restartRequestedAt: restartedAt,
			restartedAt,

			lastMissionEvent: {
				type: 'room_restarted',
				missionId: 'restart',
				missionTitle: '방 재시작',
				missionIndex: 0,
				nextMissionIndex: 0,
				status: 'playing',
				message: '선생님이 방을 미션 1부터 다시 시작했습니다.',
				version: restartVersion,
				createdAt: restartedAt
			},

			updatedAt: new Date()
		}
	});

	return {
		ok: true
	};
}
export async function approveIndividualWriteForRoom({
	lessonId,
	room,
	participant,
	feedback = '좋아요. JSON 작성 미션을 완료했습니다.'
}) {
	if (!lessonId) {
		throw new Error('수업 정보가 없습니다.');
	}

	if (!room?.id) {
		throw new Error('방 정보가 없습니다.');
	}

	if (!participant?.id) {
		throw new Error('학생 정보가 없습니다.');
	}

	if (participant?.individualWrite?.status !== 'submitted') {
		throw new Error('제출 대기 상태의 학생만 승인할 수 있습니다.');
	}

	await approveIndividualWriteSubmission({
		lessonId,
		roomId: room.id,
		participantId: participant.id,
		feedback
	});

	return { ok: true };
}

export async function rejectIndividualWriteForRoom({ lessonId, room, participant, feedback }) {
	if (!lessonId) {
		throw new Error('수업 정보가 없습니다.');
	}

	if (!room?.id) {
		throw new Error('방 정보가 없습니다.');
	}

	if (!participant?.id) {
		throw new Error('학생 정보가 없습니다.');
	}

	if (participant?.individualWrite?.status !== 'submitted') {
		throw new Error('제출 대기 상태의 학생만 반려할 수 있습니다.');
	}

	if (!feedback?.trim()) {
		throw new Error('반려 피드백을 입력하세요.');
	}

	await rejectIndividualWriteSubmission({
		lessonId,
		roomId: room.id,
		participantId: participant.id,
		feedback
	});

	return { ok: true };
}
