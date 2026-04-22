import { db } from '$lib/firebase/client';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	where
} from 'firebase/firestore';

function progressDocId(uid, lessonId, chapter) {
	return `${uid}_${lessonId}_${chapter}`;
}

/**
 * ✅ 특정 lesson/chapter progress 저장/업데이트
 * - 사용자별 lesson 진행 상태 저장
 * - 없는 문서면 생성, 있으면 merge 업데이트
 */
export async function saveLessonProgress({
	uid,
	lessonId,
	chapter,
	courseId,
	revealIndex,
	blockingIndex,
	stepIndex,
	success,
	completed,
	answers
}) {
	if (!uid) throw new Error('uid가 필요합니다.');
	if (!lessonId) throw new Error('lessonId가 필요합니다.');
	if (chapter === undefined || chapter === null) throw new Error('chapter가 필요합니다.');

	const chapterKey = String(chapter);
	const progressId = progressDocId(uid, lessonId, chapterKey);
	const ref = doc(db, 'userLessonProgress', progressId);

	const before = await getDoc(ref);
	const isNew = !before.exists();

	const payload = {
		uid,
		lessonId,
		chapter: chapterKey,
		...(courseId !== undefined ? { courseId } : {}),
		...(revealIndex !== undefined ? { revealIndex } : {}),
		...(blockingIndex !== undefined ? { blockingIndex } : {}),
		...(stepIndex !== undefined ? { stepIndex } : {}),
		...(success !== undefined ? { success } : {}),
		...(completed !== undefined ? { completed } : {}),
		...(answers !== undefined ? { answers } : {}),
		updatedAt: serverTimestamp()
	};

	await setDoc(
		ref,
		{
			...payload,
			...(isNew ? { createdAt: serverTimestamp() } : {})
		},
		{ merge: true }
	);

	return { progressId };
}

/**
 * ✅ 특정 lesson/chapter progress 조회
 */
export async function getLessonProgress({ uid, lessonId, chapter }) {
	if (!uid) throw new Error('uid가 필요합니다.');
	if (!lessonId) throw new Error('lessonId가 필요합니다.');
	if (chapter === undefined || chapter === null) throw new Error('chapter가 필요합니다.');

	const chapterKey = String(chapter);
	const ref = doc(db, 'userLessonProgress', progressDocId(uid, lessonId, chapterKey));
	const snap = await getDoc(ref);

	if (!snap.exists()) return null;
	return { id: snap.id, ...snap.data() };
}

/**
 * ✅ 사용자의 특정 course 내 progress 목록 조회
 * - course 화면에서 각 lesson/chapter 완료 여부 보여줄 때 사용
 */
export async function listLessonProgressByCourse({ uid, courseId }) {
	if (!uid) throw new Error('uid가 필요합니다.');
	if (!courseId) throw new Error('courseId가 필요합니다.');

	const q = query(
		collection(db, 'userLessonProgress'),
		where('uid', '==', uid),
		where('courseId', '==', courseId),
		orderBy('updatedAt', 'desc')
	);

	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * ✅ revealIndex만 저장
 */
export async function saveLessonReveal({ uid, lessonId, chapter, courseId, revealIndex }) {
	return saveLessonProgress({
		uid,
		lessonId,
		chapter,
		courseId,
		revealIndex
	});
}

/**
 * ✅ block 상태 저장
 */
export async function saveLessonBlockState({
	uid,
	lessonId,
	chapter,
	courseId,
	blockingIndex,
	stepIndex,
	success
}) {
	return saveLessonProgress({
		uid,
		lessonId,
		chapter,
		courseId,
		blockingIndex,
		stepIndex,
		success
	});
}

/**
 * ✅ lesson 완료 처리
 * - 끝까지 말풍선 다 봤을 때
 */
export async function completeLesson({ uid, lessonId, chapter, courseId, revealIndex }) {
	return saveLessonProgress({
		uid,
		lessonId,
		chapter,
		courseId,
		revealIndex,
		completed: true
	});
}

/**
 * ✅ 정답 제출/성공 처리
 * - block 모듈 통과 시
 */
export async function markLessonSuccess({ uid, lessonId, chapter, courseId, stepIndex, answers }) {
	return saveLessonProgress({
		uid,
		lessonId,
		chapter,
		courseId,
		stepIndex,
		blockingIndex: null,
		success: true,
		answers
	});
}
