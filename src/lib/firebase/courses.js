import { db } from '$lib/firebase/client';
import { mintInviteCode4ForCourse } from '$lib/firebase/inviteCodeCourse.js';
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	runTransaction,
	serverTimestamp,
	where,
	writeBatch
} from 'firebase/firestore';

function newId() {
	// 크롬/최신 환경이면 OK. (Node SSR 쓰면 폴리필 필요)
	return crypto.randomUUID();
}

export async function createCourse({ ownerUid, title = '새 강의', visibility = 'private' }) {
	if (!ownerUid) throw new Error('ownerUid가 필요합니다.');

	const courseId = newId();
	const courseRef = doc(db, 'courses', courseId);

	await runTransaction(db, async (tx) => {
		tx.set(courseRef, {
			ownerUid,
			title,
			visibility,
			info: '',
			lessonCount: 0,
			firstLessonId: null,
			inviteCode: null, // mintInvite가 채움
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});
	});

	// ✅ 코스 공유코드는 코스 기준으로 1개 발급
	await mintInviteCode4ForCourse({ courseId, ownerUid });

	return { courseId };
}

export async function listMyCourses(ownerUid) {
	const q = query(
		collection(db, 'courses'),
		where('ownerUid', '==', ownerUid),
		orderBy('updatedAt', 'desc')
	);

	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function listLessonsByCourse(courseId) {
	const q = query(
		collection(db, 'lessons'),
		where('courseId', '==', courseId),
		orderBy('order', 'asc'),
		limit(50)
	);

	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * ✅ 코스에 차시 추가
 * - lessons 새 문서 생성 (order = lessonCount)
 * - courses.lessonCount 증가
 */
export async function addLessonToCourse({ courseId, ownerUid, title = '새 차시' }) {
	if (!courseId) throw new Error('courseId가 필요합니다.');
	if (!ownerUid) throw new Error('ownerUid가 필요합니다.');

	const courseRef = doc(db, 'courses', courseId);
	const newLessonId = newId();
	const lessonRef = doc(db, 'lessons', newLessonId);

	await runTransaction(db, async (tx) => {
		const courseSnap = await tx.get(courseRef);
		if (!courseSnap.exists()) throw new Error('course not found');

		const course = courseSnap.data();
		const nextOrder = Number(course.lessonCount ?? 0);

		tx.set(lessonRef, {
			lessonId: newLessonId,
			ownerUid,
			courseId,
			order: nextOrder,
			title,
			info: '',
			list: [],
			steps: [],
			visibility: course.visibility ?? 'private',
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});

		const patch = {
			lessonCount: nextOrder + 1,
			updatedAt: serverTimestamp()
		};

		// ✅ 첫 차시일 때 firstLessonId 지정
		if (!course.firstLessonId) {
			patch.firstLessonId = newLessonId;
		}

		tx.set(courseRef, patch, { merge: true });
	});

	return { lessonId: newLessonId };
}

export async function getCourse(courseId) {
	const ref = doc(db, 'courses', courseId);
	const snap = await getDoc(ref);
	if (!snap.exists()) return null;
	return { id: snap.id, ...snap.data() };
}

/**
 * ✅ 코스 내 차시 순서 재정렬
 * orderedLessonIds: lessons 문서 id들의 배열 (새 순서대로)
 */
export async function reorderLessonsInCourse({ courseId, orderedLessonIds }) {
	if (!courseId) throw new Error('courseId가 필요합니다.');
	if (!Array.isArray(orderedLessonIds) || orderedLessonIds.length === 0) {
		throw new Error('orderedLessonIds가 필요합니다.');
	}

	const batch = writeBatch(db);

	orderedLessonIds.forEach((lessonDocId, idx) => {
		const ref = doc(db, 'lessons', lessonDocId);
		batch.set(ref, { order: idx, updatedAt: serverTimestamp() }, { merge: true });
	});

	// 코스 업데이트 타임스탬프도 갱신(선택)
	batch.set(doc(db, 'courses', courseId), { updatedAt: serverTimestamp() }, { merge: true });

	await batch.commit();
}

/**
 * ✅ 코스에서 차시 삭제
 * - lessons/{lessonDocId} 삭제
 * - 남은 lessons order 재정렬(0..n-1)
 * - courses.lessonCount / firstLessonId 갱신
 *
 * NOTE: MVP라서 "삭제+재정렬"을 순차로 처리 (거의 문제 없음)
 */
export async function deleteLessonFromCourse({ courseId, lessonDocId }) {
	if (!courseId) throw new Error('courseId가 필요합니다.');
	if (!lessonDocId) throw new Error('lessonDocId가 필요합니다.');

	// 1) 삭제
	await deleteDoc(doc(db, 'lessons', lessonDocId));

	// 2) 남은 차시 조회(order 순)
	const q = query(
		collection(db, 'lessons'),
		where('courseId', '==', courseId),
		orderBy('order', 'asc'),
		limit(200)
	);
	const snap = await getDocs(q);
	const remaining = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

	// 3) order 재정렬 + course 업데이트
	const batch = writeBatch(db);

	remaining.forEach((l, idx) => {
		batch.set(
			doc(db, 'lessons', l.id),
			{ order: idx, updatedAt: serverTimestamp() },
			{ merge: true }
		);
	});

	const firstLessonId = remaining.length ? remaining[0].id ?? null : null;

	batch.set(
		doc(db, 'courses', courseId),
		{
			lessonCount: remaining.length,
			firstLessonId,
			updatedAt: serverTimestamp()
		},
		{ merge: true }
	);

	await batch.commit();

	return { lessonCount: remaining.length, firstLessonId };
}
