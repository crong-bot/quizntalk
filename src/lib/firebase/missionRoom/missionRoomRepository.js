// src/lib/features/mission-room/missionRoomRepository.js

import { db } from '$lib/firebase/client';
import {
	arrayUnion,
	collection,
	deleteField,
	doc,
	getDoc,
	getDocs,
	increment,
	onSnapshot,
	orderBy,
	query,
	runTransaction,
	serverTimestamp,
	updateDoc,
	where,
	writeBatch
} from 'firebase/firestore';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomCode(len = 4) {
	let out = '';

	for (let i = 0; i < len; i += 1) {
		out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
	}

	return out;
}

function createRoomCodes(count) {
	const codes = new Set();

	while (codes.size < count) {
		codes.add(randomCode(4));
	}

	return Array.from(codes);
}

function clampRoomCount(roomCount) {
	return Math.max(1, Math.min(Number(roomCount) || 1, 10));
}
function createInitialMissionProgress(missionCount = 3) {
	const safeMissionCount = Math.max(1, Number(missionCount) || 3);

	return Array.from({ length: safeMissionCount }, (_, index) =>
		index === 0 ? 'playing' : 'locked'
	);
}
function getActiveParticipantSummaries(room) {
	if (!room?.participantSummaries || typeof room.participantSummaries !== 'object') {
		return [];
	}

	return Object.values(room.participantSummaries).filter(Boolean);
}

function getFirstEmptyRole({ room, roles = [] }) {
	const maxParticipants = room?.maxParticipants ?? 4;
	const availableRoles = roles.slice(0, maxParticipants);

	const activeSummaries = getActiveParticipantSummaries(room);
	const usedRoleIds = new Set(
		activeSummaries.map((participant) => participant?.roleId).filter(Boolean)
	);

	return (
		availableRoles.find((role) => {
			return role?.id && !usedRoleIds.has(role.id);
		}) ?? null
	);
}

function createRoomData({
	lessonId,
	roomId,
	roomNumber,
	code,
	themeId,
	themeTitle,
	maxParticipants = 4,
	autoClearedRoles = []
}) {
	return {
		id: roomId,
		lessonId,
		roomNumber,
		code,

		themeId,
		themeTitle,

		status: 'waiting', // waiting | playing | final | completed
		currentMissionIndex: 0,

		maxParticipants,
		autoClearedRoles,

		participantCount: 0,
		participantNames: [],
		participantSummaries: {},

		simulationState: {
			layers: {}
		},

		finalSubmissions: {},

		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp()
	};
}

/**
 * 수업 1개 + 방 1~10개 생성
 *
 * Firestore 구조:
 *
 * lessons/{lessonId}
 * lessons/{lessonId}/rooms/{roomId}
 * lessons/{lessonId}/rooms/{roomId}/participants/{participantId}
 * invites/{code}
 */
export async function createLessonWithRooms({
	ownerUid,
	themeId,
	themeTitle,
	categoryId,
	categoryTitle,
	roomCount = 4,
	roomCapacities = null,
	roles = []
}) {
	const safeRoomCount = clampRoomCount(roomCount);

	const capacities =
		Array.isArray(roomCapacities) && roomCapacities.length > 0
			? roomCapacities.slice(0, safeRoomCount)
			: Array(safeRoomCount).fill(4);
	const MAX_TRY = 30;

	for (let attempt = 0; attempt < MAX_TRY; attempt += 1) {
		const lessonRef = doc(collection(db, 'lessons'));
		const lessonId = lessonRef.id;

		const codes = createRoomCodes(safeRoomCount);
		const inviteRefs = codes.map((code) => doc(db, 'invites', code));

		try {
			await runTransaction(db, async (tx) => {
				// 1. 초대코드 중복 검사
				for (const inviteRef of inviteRefs) {
					const snap = await tx.get(inviteRef);

					if (snap.exists()) {
						throw new Error('DUPLICATE_CODE');
					}
				}

				// 2. lesson 문서 생성
				tx.set(lessonRef, {
					id: lessonId,
					ownerUid,

					title: `${themeTitle} 수업`,

					categoryId,
					categoryTitle,
					themeId,
					themeTitle,

					roomCount: safeRoomCount,
					status: 'waiting',

					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp()
				});

				// 3. room 문서 + invite 문서 생성
				for (let index = 0; index < safeRoomCount; index += 1) {
					const roomNumber = index + 1;
					const roomId = `room_${roomNumber}`;
					const code = codes[index];

					const roomRef = doc(db, 'lessons', lessonId, 'rooms', roomId);
					const inviteRef = inviteRefs[index];

					const maxParticipants = capacities[index] ?? 4;

					const autoClearedRoles = roles.slice(maxParticipants).map((role) => role.id);

					tx.set(
						roomRef,
						createRoomData({
							lessonId,
							roomId,
							roomNumber,
							code,
							themeId,
							themeTitle,
							maxParticipants,
							autoClearedRoles
						})
					);

					tx.set(inviteRef, {
						code,

						lessonId,
						roomId,
						roomNumber,

						maxParticipants,
						autoClearedRoles,

						ownerUid,
						themeId,
						themeTitle,

						active: true,
						status: 'waiting',

						createdAt: serverTimestamp(),
						updatedAt: serverTimestamp()
					});
				}
			});

			return {
				lessonId,
				roomCount: safeRoomCount
			};
		} catch (error) {
			if (error?.message === 'DUPLICATE_CODE') {
				continue;
			}

			throw error;
		}
	}

	throw new Error('방 코드 생성 실패. 다시 시도해 주세요.');
}

export async function getLessonById(lessonId) {
	if (!lessonId) {
		throw new Error('수업 ID가 없습니다.');
	}

	const lessonRef = doc(db, 'lessons', lessonId);
	const lessonSnap = await getDoc(lessonRef);

	if (!lessonSnap.exists()) {
		throw new Error('수업 정보를 찾을 수 없습니다.');
	}

	return {
		lessonId,
		lesson: lessonSnap.data()
	};
}

export async function getLessonRooms(lessonId) {
	if (!lessonId) {
		throw new Error('수업 ID가 없습니다.');
	}

	const roomsRef = collection(db, 'lessons', lessonId, 'rooms');
	const roomsQuery = query(roomsRef, orderBy('roomNumber', 'asc'));
	const roomsSnap = await getDocs(roomsQuery);

	return roomsSnap.docs.map((roomDoc) => ({
		id: roomDoc.id,
		...roomDoc.data()
	}));
}

export function subscribeLessonRooms(lessonId, callback, errorCallback) {
	if (!lessonId) {
		throw new Error('수업 ID가 없습니다.');
	}

	const roomsRef = collection(db, 'lessons', lessonId, 'rooms');
	const roomsQuery = query(roomsRef, orderBy('roomNumber', 'asc'));

	return onSnapshot(
		roomsQuery,
		(snapshot) => {
			const rooms = snapshot.docs.map((roomDoc) => ({
				id: roomDoc.id,
				...roomDoc.data()
			}));

			callback(rooms);
		},
		(error) => {
			console.error(error);
			errorCallback?.(error);
		}
	);
}

export async function getRoomByInviteCode(code) {
	const normalizedCode = code.trim().toUpperCase();

	if (!normalizedCode) {
		throw new Error('게임 코드가 없습니다.');
	}

	const inviteRef = doc(db, 'invites', normalizedCode);
	const inviteSnap = await getDoc(inviteRef);

	if (!inviteSnap.exists()) {
		throw new Error('존재하지 않는 게임 코드입니다.');
	}

	const invite = inviteSnap.data();

	if (!invite.active) {
		throw new Error('비활성화된 게임 코드입니다.');
	}

	const lessonRef = doc(db, 'lessons', invite.lessonId);
	const roomRef = doc(db, 'lessons', invite.lessonId, 'rooms', invite.roomId);

	const [lessonSnap, roomSnap] = await Promise.all([getDoc(lessonRef), getDoc(roomRef)]);

	if (!lessonSnap.exists()) {
		throw new Error('수업 정보를 찾을 수 없습니다.');
	}

	if (!roomSnap.exists()) {
		throw new Error('방 정보를 찾을 수 없습니다.');
	}

	return {
		code: normalizedCode,
		invite,
		lesson: lessonSnap.data(),
		room: {
			id: roomSnap.id,
			...roomSnap.data()
		},
		lessonId: invite.lessonId,
		roomId: invite.roomId
	};
}

export function subscribeRoom({ lessonId, roomId }, callback, errorCallback) {
	if (!lessonId || !roomId) {
		throw new Error('방 정보가 부족합니다.');
	}

	const roomRef = doc(db, 'lessons', lessonId, 'rooms', roomId);

	return onSnapshot(
		roomRef,
		(snapshot) => {
			if (!snapshot.exists()) {
				errorCallback?.(new Error('방 정보를 찾을 수 없습니다.'));
				return;
			}

			callback({
				id: snapshot.id,
				...snapshot.data()
			});
		},
		(error) => {
			console.error(error);
			errorCallback?.(error);
		}
	);
}

export function subscribeParticipants({ lessonId, roomId }, callback, errorCallback) {
	if (!lessonId || !roomId) {
		throw new Error('방 정보가 부족합니다.');
	}

	const participantsRef = collection(db, 'lessons', lessonId, 'rooms', roomId, 'participants');

	return onSnapshot(
		participantsRef,
		(snapshot) => {
			const participants = snapshot.docs
				.map((participantDoc) => ({
					id: participantDoc.id,
					...participantDoc.data()
				}))
				.filter((participant) => {
					return participant.active !== false && participant.status !== 'left';
				});

			callback(participants);
		},
		(error) => {
			console.error(error);
			errorCallback?.(error);
		}
	);
}

export async function joinRoom({
	lessonId,
	roomId,
	participantId,
	name,
	roles = [],
	missionCount = 3
}) {
	if (!lessonId || !roomId) {
		throw new Error('방 정보가 부족합니다.');
	}

	if (!participantId) {
		throw new Error('참가자 ID가 없습니다.');
	}

	if (!name?.trim()) {
		throw new Error('이름을 입력하세요.');
	}

	const roomRef = doc(db, 'lessons', lessonId, 'rooms', roomId);
	const participantRef = doc(
		db,
		'lessons',
		lessonId,
		'rooms',
		roomId,
		'participants',
		participantId
	);

	return runTransaction(db, async (tx) => {
		const roomSnap = await tx.get(roomRef);

		if (!roomSnap.exists()) {
			throw new Error('방 정보를 찾을 수 없습니다.');
		}

		const participantSnap = await tx.get(participantRef);
		const room = roomSnap.data();

		if (participantSnap.exists()) {
			const savedParticipant = participantSnap.data();

			const wasLeft = savedParticipant.active === false || savedParticipant.status === 'left';

			const currentCount = room.participantCount ?? 0;
			const maxParticipants = room.maxParticipants ?? 4;

			if (!wasLeft) {
				const savedRoleId = savedParticipant.roleId ?? null;
				const savedRoleName = savedParticipant.roleName ?? null;
				const savedAvatarSrc = savedParticipant.avatarSrc ?? null;

				tx.set(
					participantRef,
					{
						id: participantId,
						name: name.trim(),

						roleId: savedRoleId,
						roleName: savedRoleName,
						avatarSrc: savedAvatarSrc,

						active: true,
						status: 'playing',

						missionProgress:
							savedParticipant.missionProgress ?? createInitialMissionProgress(missionCount),
						learningStats: savedParticipant.learningStats ?? {
							totalAttempts: 0,
							successCount: 0,
							failCount: 0,
							conceptErrors: {},
							missionStats: {}
						},

						joinedAt: savedParticipant.joinedAt,
						updatedAt: serverTimestamp()
					},
					{ merge: true }
				);

				tx.update(roomRef, {
					[`participantSummaries.${participantId}`]: {
						id: participantId,
						name: name.trim(),
						roleId: savedRoleId,
						roleName: savedRoleName,
						avatarSrc: savedAvatarSrc
					},
					updatedAt: serverTimestamp()
				});

				return {
					roleId: savedRoleId,
					roleName: savedRoleName,
					avatarSrc: savedAvatarSrc
				};
			}

			if (currentCount >= maxParticipants) {
				throw new Error('이 방은 정원이 가득 찼습니다.');
			}

			const assignedRole = getFirstEmptyRole({
				room,
				roles
			});

			if (!assignedRole) {
				throw new Error('배정할 수 있는 빈 역할이 없습니다.');
			}

			const assignedRoleId = assignedRole.id ?? null;
			const assignedRoleName = assignedRole.roleName ?? assignedRole.name ?? null;
			const assignedAvatarSrc = assignedRole.avatarSrc ?? null;

			const nextCount = currentCount + 1;

			tx.set(
				participantRef,
				{
					id: participantId,
					name: name.trim(),

					roleId: assignedRoleId,
					roleName: assignedRoleName,
					avatarSrc: assignedAvatarSrc,

					active: true,
					status: 'playing',

					missionProgress: createInitialMissionProgress(missionCount),
					learningStats: savedParticipant.learningStats ?? {
						totalAttempts: 0,
						successCount: 0,
						failCount: 0,
						conceptErrors: {},
						missionStats: {}
					},

					joinedAt: savedParticipant.joinedAt ?? serverTimestamp(),
					rejoinedAt: serverTimestamp(),
					updatedAt: serverTimestamp()
				},
				{ merge: true }
			);

			tx.update(roomRef, {
				participantCount: nextCount,
				participantNames: arrayUnion(name.trim()),
				[`participantSummaries.${participantId}`]: {
					id: participantId,
					name: name.trim(),
					roleId: assignedRoleId,
					roleName: assignedRoleName,
					avatarSrc: assignedAvatarSrc
				},
				status: nextCount >= maxParticipants ? 'playing' : 'waiting',
				updatedAt: serverTimestamp()
			});

			return {
				roleId: assignedRoleId,
				roleName: assignedRoleName,
				avatarSrc: assignedAvatarSrc
			};
		}

		const participantCount = room.participantCount ?? 0;
		const maxParticipants = room.maxParticipants ?? 4;

		if (participantCount >= maxParticipants) {
			throw new Error('이 방은 정원이 가득 찼습니다.');
		}

		const assignedRole = getFirstEmptyRole({
			room,
			roles
		});

		if (!assignedRole) {
			throw new Error('배정할 수 있는 빈 역할이 없습니다.');
		}

		const assignedRoleId = assignedRole.id ?? null;
		const assignedRoleName = assignedRole.roleName ?? assignedRole.name ?? null;
		const assignedAvatarSrc = assignedRole.avatarSrc ?? null;

		tx.set(
			participantRef,
			{
				id: participantId,
				name: name.trim(),

				roleId: assignedRoleId,
				roleName: assignedRoleName,
				avatarSrc: assignedAvatarSrc,

				active: true,
				status: 'playing',

				missionProgress: createInitialMissionProgress(missionCount),
				learningStats: {
					totalAttempts: 0,
					successCount: 0,
					failCount: 0,
					conceptErrors: {},
					missionStats: {}
				},

				joinedAt: serverTimestamp(),
				updatedAt: serverTimestamp()
			},
			{ merge: true }
		);

		tx.update(roomRef, {
			participantCount: participantCount + 1,
			participantNames: arrayUnion(name.trim()),
			[`participantSummaries.${participantId}`]: {
				id: participantId,
				name: name.trim(),
				roleId: assignedRoleId,
				roleName: assignedRoleName,
				avatarSrc: assignedAvatarSrc
			},
			status: participantCount + 1 >= maxParticipants ? 'playing' : 'waiting',
			updatedAt: serverTimestamp()
		});

		return {
			roleId: assignedRoleId,
			roleName: assignedRoleName,
			avatarSrc: assignedAvatarSrc
		};
	});
}
export async function leaveRoom({ lessonId, roomId, participantId }) {
	if (!lessonId || !roomId) {
		throw new Error('방 정보가 부족합니다.');
	}

	if (!participantId) {
		throw new Error('참가자 정보가 없습니다.');
	}

	const roomRef = doc(db, 'lessons', lessonId, 'rooms', roomId);
	const participantRef = doc(
		db,
		'lessons',
		lessonId,
		'rooms',
		roomId,
		'participants',
		participantId
	);

	await runTransaction(db, async (tx) => {
		const roomSnap = await tx.get(roomRef);
		const participantSnap = await tx.get(participantRef);

		if (!roomSnap.exists()) {
			throw new Error('방 정보를 찾을 수 없습니다.');
		}

		if (!participantSnap.exists()) {
			return;
		}

		const room = roomSnap.data();
		const participant = participantSnap.data();

		if (participant?.active === false || participant?.status === 'left') {
			return;
		}

		const currentCount = room.participantCount ?? 0;
		const nextCount = Math.max(currentCount - 1, 0);
		const maxParticipants = room.maxParticipants ?? 4;

		const nextStatus =
			room.status === 'completed'
				? 'completed'
				: nextCount >= maxParticipants
				  ? room.status ?? 'playing'
				  : 'waiting';

		tx.update(participantRef, {
			active: false,
			status: 'left',
			leftAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});

		tx.update(roomRef, {
			participantCount: nextCount,
			[`participantSummaries.${participantId}`]: deleteField(),
			status: nextStatus,
			updatedAt: serverTimestamp()
		});
	});
}

export async function updateRoomState({ lessonId, roomId, patch }) {
	if (!lessonId || !roomId) {
		throw new Error('방 정보가 부족합니다.');
	}

	const roomRef = doc(db, 'lessons', lessonId, 'rooms', roomId);

	await updateDoc(roomRef, {
		...patch,
		updatedAt: serverTimestamp()
	});
}

export async function updateParticipantProgress({
	lessonId,
	roomId,
	participantId,
	missionProgress
}) {
	if (!lessonId || !roomId || !participantId) {
		throw new Error('참가자 진행도 업데이트 정보가 부족합니다.');
	}

	const participantRef = doc(
		db,
		'lessons',
		lessonId,
		'rooms',
		roomId,
		'participants',
		participantId
	);

	await updateDoc(participantRef, {
		missionProgress,
		updatedAt: serverTimestamp()
	});
}
export async function resetRoomParticipantsProgress({ lessonId, roomId, missionCount }) {
	if (!lessonId || !roomId) {
		throw new Error('방 정보가 부족합니다.');
	}

	const safeMissionCount = Math.max(1, Number(missionCount) || 1);

	const initialMissionProgress = Array.from({ length: safeMissionCount }, (_, index) => {
		return index === 0 ? 'playing' : 'locked';
	});

	const participantsRef = collection(db, 'lessons', lessonId, 'rooms', roomId, 'participants');
	const participantsSnap = await getDocs(participantsRef);

	const batch = writeBatch(db);

	participantsSnap.docs.forEach((participantDoc) => {
		batch.update(participantDoc.ref, {
			missionProgress: [...initialMissionProgress],
			currentMissionIndex: 0,
			status: 'playing',
			updatedAt: serverTimestamp()
		});
	});

	await batch.commit();
}
export async function approveReadMissionSubmission({
	lessonId,
	roomId,
	missionId,
	reviewKey,
	participantId,
	missionProgress,
	roomPatch = {}
}) {
	if (!lessonId || !roomId) {
		throw new Error('방 정보가 부족합니다.');
	}

	if (!missionId || !reviewKey) {
		throw new Error('승인할 제출 정보가 부족합니다.');
	}

	const batch = writeBatch(db);
	const roomRef = doc(db, 'lessons', lessonId, 'rooms', roomId);
	const approvedAt = new Date().toISOString();

	batch.update(roomRef, {
		[`pendingReviews.${missionId}.${reviewKey}.status`]: 'approved',
		[`pendingReviews.${missionId}.${reviewKey}.approvedAt`]: approvedAt,
		[`pendingReviews.${missionId}.${reviewKey}.updatedAt`]: approvedAt,
		...roomPatch,
		updatedAt: serverTimestamp()
	});

	if (participantId && Array.isArray(missionProgress)) {
		const participantRef = doc(
			db,
			'lessons',
			lessonId,
			'rooms',
			roomId,
			'participants',
			participantId
		);

		batch.update(participantRef, {
			missionProgress,
			updatedAt: serverTimestamp()
		});
	}

	await batch.commit();
}

export async function rejectReadMissionSubmission({
	lessonId,
	roomId,
	missionId,
	reviewKey,
	reason = ''
}) {
	if (!lessonId || !roomId) {
		throw new Error('방 정보가 부족합니다.');
	}

	if (!missionId || !reviewKey) {
		throw new Error('반려할 제출 정보가 부족합니다.');
	}

	const rejectedAt = new Date().toISOString();
	const roomRef = doc(db, 'lessons', lessonId, 'rooms', roomId);

	await updateDoc(roomRef, {
		[`pendingReviews.${missionId}.${reviewKey}.status`]: 'rejected',
		[`pendingReviews.${missionId}.${reviewKey}.rejectReason`]: reason,
		[`pendingReviews.${missionId}.${reviewKey}.rejectedAt`]: rejectedAt,
		[`pendingReviews.${missionId}.${reviewKey}.updatedAt`]: rejectedAt,
		reviewStatus: 'rejected',
		updatedAt: serverTimestamp()
	});
}
export async function submitReadMissionReview({
	lessonId,
	roomId,
	missionId,
	reviewKey,
	reviewData
}) {
	if (!lessonId || !roomId) {
		throw new Error('방 정보가 부족합니다.');
	}

	if (!missionId || !reviewKey) {
		throw new Error('제출 정보가 부족합니다.');
	}

	const roomRef = doc(db, 'lessons', lessonId, 'rooms', roomId);

	await updateDoc(roomRef, {
		[`pendingReviews.${missionId}.${reviewKey}`]: reviewData,
		reviewStatus: 'pending',
		updatedAt: serverTimestamp()
	});
}

export async function approveReadMissionReview({
	lessonId,
	roomId,
	missionId,
	reviewKeys = [],
	participantProgressUpdates = [],
	roomPatch = {}
}) {
	if (!lessonId || !roomId) {
		throw new Error('방 정보가 부족합니다.');
	}

	if (!missionId) {
		throw new Error('승인할 미션 정보가 부족합니다.');
	}

	const batch = writeBatch(db);
	const roomRef = doc(db, 'lessons', lessonId, 'rooms', roomId);
	const approvedAt = new Date().toISOString();

	const roomUpdate = {
		...roomPatch,
		reviewStatus: 'approved',
		updatedAt: serverTimestamp()
	};

	for (const reviewKey of reviewKeys) {
		roomUpdate[`pendingReviews.${missionId}.${reviewKey}.status`] = 'approved';
		roomUpdate[`pendingReviews.${missionId}.${reviewKey}.approvedAt`] = approvedAt;
		roomUpdate[`pendingReviews.${missionId}.${reviewKey}.updatedAt`] = approvedAt;
	}

	batch.update(roomRef, roomUpdate);

	for (const item of participantProgressUpdates) {
		if (!item?.participantId || !Array.isArray(item?.missionProgress)) continue;

		const participantRef = doc(
			db,
			'lessons',
			lessonId,
			'rooms',
			roomId,
			'participants',
			item.participantId
		);

		batch.update(participantRef, {
			missionProgress: item.missionProgress,
			updatedAt: serverTimestamp()
		});
	}

	await batch.commit();
}

export async function rejectReadMissionReview({
	lessonId,
	roomId,
	missionId,
	reviewKey,
	reason = ''
}) {
	if (!lessonId || !roomId) {
		throw new Error('방 정보가 부족합니다.');
	}

	if (!missionId || !reviewKey) {
		throw new Error('반려할 제출 정보가 부족합니다.');
	}

	const roomRef = doc(db, 'lessons', lessonId, 'rooms', roomId);
	const rejectedAt = new Date().toISOString();

	await updateDoc(roomRef, {
		[`pendingReviews.${missionId}.${reviewKey}.status`]: 'rejected',
		[`pendingReviews.${missionId}.${reviewKey}.rejectReason`]: reason,
		[`pendingReviews.${missionId}.${reviewKey}.rejectedAt`]: rejectedAt,
		[`pendingReviews.${missionId}.${reviewKey}.updatedAt`]: rejectedAt,
		reviewStatus: 'rejected',
		updatedAt: serverTimestamp()
	});
}

export async function applyMissionSuccess({
	lessonId,
	roomId,
	participantId,
	missionProgress,
	simulationState,
	currentMissionIndex,
	status,
	lastMissionEvent = null
}) {
	if (!lessonId || !roomId || !participantId) {
		throw new Error('미션 성공 처리 정보가 부족합니다.');
	}

	const batch = writeBatch(db);

	const roomRef = doc(db, 'lessons', lessonId, 'rooms', roomId);
	const participantRef = doc(
		db,
		'lessons',
		lessonId,
		'rooms',
		roomId,
		'participants',
		participantId
	);

	batch.update(participantRef, {
		missionProgress,
		updatedAt: serverTimestamp()
	});

	const roomPatch = {
		updatedAt: serverTimestamp()
	};

	if (simulationState) {
		roomPatch.simulationState = simulationState;
	}

	if (typeof currentMissionIndex === 'number') {
		roomPatch.currentMissionIndex = currentMissionIndex;
	}

	if (status) {
		roomPatch.status = status;
	}
	if (lastMissionEvent) {
		roomPatch.lastMissionEvent = lastMissionEvent;
	}

	batch.update(roomRef, roomPatch);

	await batch.commit();
}

export async function recordParticipantAttempt({
	lessonId,
	roomId,
	participantId,
	missionIndex,
	ok,
	concepts = []
}) {
	if (!lessonId || !roomId || !participantId) {
		throw new Error('참가자 활동 기록 정보가 부족합니다.');
	}

	if (typeof missionIndex !== 'number') {
		throw new Error('미션 번호가 없습니다.');
	}

	const participantRef = doc(
		db,
		'lessons',
		lessonId,
		'rooms',
		roomId,
		'participants',
		participantId
	);

	const uniqueConcepts = Array.from(new Set(concepts.filter(Boolean)));

	const patch = {
		'learningStats.totalAttempts': increment(1),
		[`learningStats.missionStats.${missionIndex}.attempts`]: increment(1),
		updatedAt: serverTimestamp()
	};

	if (ok) {
		patch['learningStats.successCount'] = increment(1);
		patch[`learningStats.missionStats.${missionIndex}.successCount`] = increment(1);
		patch[`learningStats.missionStats.${missionIndex}.success`] = true;
	} else {
		patch['learningStats.failCount'] = increment(1);
		patch[`learningStats.missionStats.${missionIndex}.failCount`] = increment(1);
		patch[`learningStats.missionStats.${missionIndex}.success`] = false;

		for (const concept of uniqueConcepts) {
			patch[`learningStats.conceptErrors.${concept}`] = increment(1);
			patch[`learningStats.missionStats.${missionIndex}.errors.${concept}`] = increment(1);
		}
	}

	await updateDoc(participantRef, patch);
}

export function subscribeTeacherLessons(ownerUid, callback, errorCallback) {
	if (!ownerUid) {
		throw new Error('교사 정보가 없습니다.');
	}

	const lessonsRef = collection(db, 'lessons');
	const lessonsQuery = query(
		lessonsRef,
		where('ownerUid', '==', ownerUid),
		orderBy('createdAt', 'desc')
	);

	return onSnapshot(
		lessonsQuery,
		(snapshot) => {
			const lessons = snapshot.docs.map((lessonDoc) => ({
				id: lessonDoc.id,
				...lessonDoc.data()
			}));

			callback(lessons);
		},
		(error) => {
			console.error(error);
			errorCallback?.(error);
		}
	);
}

function getTopConceptsFromErrors(conceptErrors = {}, limit = 3) {
	return Object.entries(conceptErrors)
		.sort((a, b) => b[1] - a[1])
		.slice(0, limit)
		.map(([concept, count]) => ({
			concept,
			count
		}));
}

function addConceptStats(target, conceptErrors = {}) {
	for (const [concept, count] of Object.entries(conceptErrors)) {
		target[concept] = (target[concept] ?? 0) + count;
	}
}

export async function completeLesson({ lessonId }) {
	if (!lessonId) {
		throw new Error('수업 ID가 없습니다.');
	}

	const lessonRef = doc(db, 'lessons', lessonId);
	const lessonSnap = await getDoc(lessonRef);

	if (!lessonSnap.exists()) {
		throw new Error('수업 정보를 찾을 수 없습니다.');
	}

	const roomsRef = collection(db, 'lessons', lessonId, 'rooms');
	const roomsSnap = await getDocs(query(roomsRef, orderBy('roomNumber', 'asc')));

	const rooms = [];
	const conceptStats = {};
	let totalParticipants = 0;
	let completedRoomCount = 0;

	for (const roomDoc of roomsSnap.docs) {
		const room = {
			id: roomDoc.id,
			...roomDoc.data()
		};

		const participantsRef = collection(
			db,
			'lessons',
			lessonId,
			'rooms',
			roomDoc.id,
			'participants'
		);

		const participantsSnap = await getDocs(participantsRef);

		const students = participantsSnap.docs.map((participantDoc) => {
			const participant = {
				id: participantDoc.id,
				...participantDoc.data()
			};

			const learningStats = participant.learningStats ?? {};
			const conceptErrors = learningStats.conceptErrors ?? {};

			addConceptStats(conceptStats, conceptErrors);

			return {
				participantId: participant.id,
				name: participant.name ?? '',
				roleId: participant.roleId ?? '',
				roleName: participant.roleName ?? '',
				avatarSrc: participant.avatarSrc ?? '',

				missionProgress: participant.missionProgress ?? [],

				totalAttempts: learningStats.totalAttempts ?? 0,
				successCount: learningStats.successCount ?? 0,
				failCount: learningStats.failCount ?? 0,
				conceptErrors,
				topConcepts: getTopConceptsFromErrors(conceptErrors),
				missionStats: learningStats.missionStats ?? {}
			};
		});

		totalParticipants += students.length;

		const isRoomCompleted = room.status === 'completed';

		if (isRoomCompleted) {
			completedRoomCount += 1;
		}

		rooms.push({
			roomId: room.id,
			roomNumber: room.roomNumber ?? 0,
			code: room.code ?? '',
			status: room.status ?? 'waiting',
			currentMissionIndex: room.currentMissionIndex ?? 0,
			maxParticipants: room.maxParticipants ?? 4,
			participantCount: students.length,
			completed: isRoomCompleted,
			students
		});
	}

	const summary = {
		totalParticipants,
		roomCount: rooms.length,
		completedRoomCount,
		conceptStats,
		topConcepts: getTopConceptsFromErrors(conceptStats, 5),
		rooms
	};

	const batch = writeBatch(db);

	batch.update(lessonRef, {
		status: 'completed',
		completedAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
		summary
	});

	for (const room of rooms) {
		if (room.code) {
			const inviteRef = doc(db, 'invites', room.code);

			batch.update(inviteRef, {
				active: false,
				status: 'completed',
				updatedAt: serverTimestamp()
			});
		}
	}

	await batch.commit();

	return summary;
}

export async function deleteLessonCompletely({ lessonId }) {
	if (!lessonId) {
		throw new Error('수업 ID가 없습니다.');
	}

	const lessonRef = doc(db, 'lessons', lessonId);
	const roomsRef = collection(db, 'lessons', lessonId, 'rooms');
	const roomsSnap = await getDocs(roomsRef);

	const batch = writeBatch(db);

	for (const roomDoc of roomsSnap.docs) {
		const room = roomDoc.data();

		const participantsRef = collection(
			db,
			'lessons',
			lessonId,
			'rooms',
			roomDoc.id,
			'participants'
		);

		const participantsSnap = await getDocs(participantsRef);

		for (const participantDoc of participantsSnap.docs) {
			batch.delete(participantDoc.ref);
		}

		if (room.code) {
			const inviteRef = doc(db, 'invites', room.code);
			batch.delete(inviteRef);
		}

		batch.delete(roomDoc.ref);
	}

	batch.delete(lessonRef);

	await batch.commit();
}
export async function createIndividualWriteLessonRoom({
	ownerUid,
	title,
	description,
	notes = [],
	exampleCode = '',
	maxParticipants = 40
}) {
	if (!ownerUid) {
		throw new Error('교사 정보가 없습니다.');
	}

	if (!title?.trim()) {
		throw new Error('미션 제목을 입력하세요.');
	}

	if (!description?.trim()) {
		throw new Error('상황 설명을 입력하세요.');
	}

	const safeMaxParticipants = Math.max(1, Math.min(Number(maxParticipants) || 40, 40));
	const MAX_TRY = 30;

	for (let attempt = 0; attempt < MAX_TRY; attempt += 1) {
		const lessonRef = doc(collection(db, 'lessons'));
		const lessonId = lessonRef.id;

		const code = randomCode(4);
		const inviteRef = doc(db, 'invites', code);

		const roomId = 'room_1';
		const roomRef = doc(db, 'lessons', lessonId, 'rooms', roomId);

		try {
			await runTransaction(db, async (tx) => {
				const inviteSnap = await tx.get(inviteRef);

				if (inviteSnap.exists()) {
					throw new Error('DUPLICATE_CODE');
				}

				const mission = {
					title: title.trim(),
					description: description.trim(),
					notes: Array.isArray(notes) ? notes.filter(Boolean) : [],
					exampleCode: exampleCode ?? ''
				};

				tx.set(lessonRef, {
					id: lessonId,
					ownerUid,

					title: title.trim(),

					categoryId: 'individual-write',
					categoryTitle: '개인 작성미션',
					themeId: 'individualWrite',
					themeTitle: '데이터 작성 미션',

					missionType: 'individual-write',
					roomCount: 1,
					status: 'waiting',

					individualWriteMission: mission,

					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp()
				});

				tx.set(roomRef, {
					id: roomId,
					lessonId,
					roomNumber: 1,
					code,

					categoryId: 'individual-write',
					categoryTitle: '개인 작성미션',
					themeId: 'individualWrite',
					themeTitle: '데이터 작성 미션',

					missionType: 'individual-write',
					status: 'waiting',

					maxParticipants: safeMaxParticipants,
					participantCount: 0,
					participantNames: [],
					participantSummaries: {},

					individualWriteMission: mission,

					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp()
				});

				tx.set(inviteRef, {
					code,

					lessonId,
					roomId,
					roomNumber: 1,

					missionType: 'individual-write',

					maxParticipants: safeMaxParticipants,

					ownerUid,
					themeId: 'individualWrite',
					themeTitle: '데이터 작성 미션',

					active: true,
					status: 'waiting',

					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp()
				});
			});

			return {
				lessonId,
				roomId,
				code,
				roomCount: 1
			};
		} catch (error) {
			if (error?.message === 'DUPLICATE_CODE') {
				continue;
			}

			throw error;
		}
	}

	throw new Error('방 코드 생성 실패. 다시 시도해 주세요.');
}
export async function joinIndividualWriteRoom({ lessonId, roomId, participantId, name }) {
	if (!lessonId || !roomId) {
		throw new Error('방 정보가 부족합니다.');
	}

	if (!participantId) {
		throw new Error('참가자 ID가 없습니다.');
	}

	if (!name?.trim()) {
		throw new Error('이름을 입력하세요.');
	}

	const roomRef = doc(db, 'lessons', lessonId, 'rooms', roomId);
	const participantRef = doc(
		db,
		'lessons',
		lessonId,
		'rooms',
		roomId,
		'participants',
		participantId
	);

	const defaultIndividualWrite = {
		status: 'writing',
		jsonText: '',
		feedback: '',
		submittedAt: null,
		reviewedAt: null
	};

	return runTransaction(db, async (tx) => {
		const roomSnap = await tx.get(roomRef);

		if (!roomSnap.exists()) {
			throw new Error('방 정보를 찾을 수 없습니다.');
		}

		const room = roomSnap.data();
		const participantSnap = await tx.get(participantRef);

		const currentCount = room.participantCount ?? 0;
		const maxParticipants = room.maxParticipants ?? 40;

		if (participantSnap.exists()) {
			const savedParticipant = participantSnap.data();
			const wasLeft = savedParticipant.active === false || savedParticipant.status === 'left';
			const savedIndividualWrite = savedParticipant.individualWrite ?? defaultIndividualWrite;

			if (!wasLeft) {
				tx.set(
					participantRef,
					{
						id: participantId,
						name: name.trim(),
						active: true,
						status: savedParticipant.status ?? 'playing',
						individualWrite: savedIndividualWrite,
						joinedAt: savedParticipant.joinedAt,
						updatedAt: serverTimestamp()
					},
					{ merge: true }
				);

				tx.update(roomRef, {
					[`participantSummaries.${participantId}`]: {
						id: participantId,
						name: name.trim(),
						status: savedParticipant.status ?? 'playing',
						individualWrite: savedIndividualWrite
					},
					updatedAt: serverTimestamp()
				});

				return {
					ok: true
				};
			}

			if (currentCount >= maxParticipants) {
				throw new Error('이 방은 정원이 가득 찼습니다.');
			}

			tx.set(
				participantRef,
				{
					id: participantId,
					name: name.trim(),
					active: true,
					status: 'playing',
					individualWrite: savedIndividualWrite,
					joinedAt: savedParticipant.joinedAt ?? serverTimestamp(),
					rejoinedAt: serverTimestamp(),
					updatedAt: serverTimestamp()
				},
				{ merge: true }
			);

			tx.update(roomRef, {
				participantCount: currentCount + 1,
				participantNames: arrayUnion(name.trim()),
				[`participantSummaries.${participantId}`]: {
					id: participantId,
					name: name.trim(),
					status: 'playing',
					individualWrite: savedIndividualWrite
				},
				status: 'playing',
				updatedAt: serverTimestamp()
			});

			return {
				ok: true
			};
		}

		if (currentCount >= maxParticipants) {
			throw new Error('이 방은 정원이 가득 찼습니다.');
		}

		tx.set(
			participantRef,
			{
				id: participantId,
				name: name.trim(),
				active: true,
				status: 'playing',
				individualWrite: defaultIndividualWrite,
				joinedAt: serverTimestamp(),
				updatedAt: serverTimestamp()
			},
			{ merge: true }
		);

		tx.update(roomRef, {
			participantCount: currentCount + 1,
			participantNames: arrayUnion(name.trim()),
			[`participantSummaries.${participantId}`]: {
				id: participantId,
				name: name.trim(),
				status: 'playing',
				individualWrite: defaultIndividualWrite
			},
			status: 'playing',
			updatedAt: serverTimestamp()
		});

		return {
			ok: true
		};
	});
}
export async function submitIndividualWriteMission({ lessonId, roomId, participantId, jsonText }) {
	if (!lessonId || !roomId || !participantId) {
		throw new Error('제출 정보가 부족합니다.');
	}

	if (!jsonText?.trim()) {
		throw new Error('제출할 JSON이 없습니다.');
	}

	const submittedAt = new Date().toISOString();

	const participantRef = doc(
		db,
		'lessons',
		lessonId,
		'rooms',
		roomId,
		'participants',
		participantId
	);

	const roomRef = doc(db, 'lessons', lessonId, 'rooms', roomId);

	await updateDoc(participantRef, {
		'individualWrite.status': 'submitted',
		'individualWrite.jsonText': jsonText,
		'individualWrite.feedback': '',
		'individualWrite.submittedAt': submittedAt,
		'individualWrite.reviewedAt': null,
		status: 'submitted',
		updatedAt: serverTimestamp()
	});

	await updateDoc(roomRef, {
		[`participantSummaries.${participantId}.individualWrite`]: {
			status: 'submitted',
			jsonText,
			feedback: '',
			submittedAt,
			reviewedAt: null
		},
		[`participantSummaries.${participantId}.status`]: 'submitted',
		updatedAt: serverTimestamp()
	});
}
export async function approveIndividualWriteSubmission({
	lessonId,
	roomId,
	participantId,
	feedback = '좋아요. JSON 작성 미션을 완료했습니다.'
}) {
	if (!lessonId || !roomId || !participantId) {
		throw new Error('승인 정보가 부족합니다.');
	}

	const reviewedAt = new Date().toISOString();

	const participantRef = doc(
		db,
		'lessons',
		lessonId,
		'rooms',
		roomId,
		'participants',
		participantId
	);

	const roomRef = doc(db, 'lessons', lessonId, 'rooms', roomId);

	await updateDoc(participantRef, {
		'individualWrite.status': 'approved',
		'individualWrite.feedback': feedback,
		'individualWrite.reviewedAt': reviewedAt,
		status: 'cleared',
		updatedAt: serverTimestamp()
	});

	await updateDoc(roomRef, {
		[`participantSummaries.${participantId}.individualWrite.status`]: 'approved',
		[`participantSummaries.${participantId}.individualWrite.feedback`]: feedback,
		[`participantSummaries.${participantId}.individualWrite.reviewedAt`]: reviewedAt,
		[`participantSummaries.${participantId}.status`]: 'cleared',
		updatedAt: serverTimestamp()
	});
}

export async function rejectIndividualWriteSubmission({
	lessonId,
	roomId,
	participantId,
	feedback
}) {
	if (!lessonId || !roomId || !participantId) {
		throw new Error('반려 정보가 부족합니다.');
	}

	if (!feedback?.trim()) {
		throw new Error('반려 피드백을 입력하세요.');
	}

	const reviewedAt = new Date().toISOString();

	const participantRef = doc(
		db,
		'lessons',
		lessonId,
		'rooms',
		roomId,
		'participants',
		participantId
	);

	const roomRef = doc(db, 'lessons', lessonId, 'rooms', roomId);

	await updateDoc(participantRef, {
		'individualWrite.status': 'rejected',
		'individualWrite.feedback': feedback.trim(),
		'individualWrite.reviewedAt': reviewedAt,
		status: 'playing',
		updatedAt: serverTimestamp()
	});

	await updateDoc(roomRef, {
		[`participantSummaries.${participantId}.individualWrite.status`]: 'rejected',
		[`participantSummaries.${participantId}.individualWrite.feedback`]: feedback.trim(),
		[`participantSummaries.${participantId}.individualWrite.reviewedAt`]: reviewedAt,
		[`participantSummaries.${participantId}.status`]: 'playing',
		updatedAt: serverTimestamp()
	});
}
export async function leaveIndividualWriteRoom({ lessonId, roomId, participantId }) {
	if (!lessonId || !roomId || !participantId) {
		throw new Error('나가기 정보가 부족합니다.');
	}

	const roomRef = doc(db, 'lessons', lessonId, 'rooms', roomId);
	const participantRef = doc(
		db,
		'lessons',
		lessonId,
		'rooms',
		roomId,
		'participants',
		participantId
	);

	return runTransaction(db, async (tx) => {
		const roomSnap = await tx.get(roomRef);
		const participantSnap = await tx.get(participantRef);

		if (!roomSnap.exists()) {
			throw new Error('방 정보를 찾을 수 없습니다.');
		}

		if (!participantSnap.exists()) {
			return { ok: true };
		}

		const room = roomSnap.data();
		const participant = participantSnap.data();

		if (participant.active === false || participant.status === 'left') {
			return { ok: true };
		}

		const currentCount = room.participantCount ?? 0;

		tx.set(
			participantRef,
			{
				active: false,
				status: 'left',
				leftAt: serverTimestamp(),
				updatedAt: serverTimestamp()
			},
			{ merge: true }
		);

		tx.update(roomRef, {
			participantCount: Math.max(0, currentCount - 1),
			[`participantSummaries.${participantId}.active`]: false,
			[`participantSummaries.${participantId}.status`]: 'left',
			[`participantSummaries.${participantId}.leftAt`]: serverTimestamp(),
			updatedAt: serverTimestamp()
		});

		return { ok: true };
	});
}
