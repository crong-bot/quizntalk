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

/**
 * ✅ Lesson 저장
 * - inviteCode 생성 ❌ (코스에서만 관리)
 * - courseId, order 포함
 */
export async function saveLesson({
	lessonId,
	courseId,
	ownerUid,
	order,
	title,
	info,
	list,
	steps,
	visibility = 'private'
}) {
	if (!lessonId) throw new Error('lessonId가 필요합니다.');
	if (!ownerUid) throw new Error('ownerUid가 필요합니다.');
	if (!courseId) throw new Error('courseId가 필요합니다.');

	const ref = doc(db, 'lessons', lessonId);

	// 처음 생성인지 판단
	const before = await getDoc(ref);
	const isNew = !before.exists();

	const payload = {
		lessonId,
		ownerUid,
		courseId,
		...(order !== undefined ? { order } : {}),
		title: title ?? '',
		info: info ?? '',
		list: Array.isArray(list) ? list : [],
		steps: Array.isArray(steps) ? steps : [],
		visibility,
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

	return { lessonId };
}

export async function getLesson(lessonId) {
	const ref = doc(db, 'lessons', lessonId);
	const snap = await getDoc(ref);
	if (!snap.exists()) return null;
	return snap.data();
}

export async function listMyLessons(ownerUid) {
	const q = query(
		collection(db, 'lessons'),
		where('ownerUid', '==', ownerUid),
		orderBy('updatedAt', 'desc')
	);

	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ✅ 차시 제목만 수정 (library에서 사용)
export async function updateLessonTitle({ lessonId, title }) {
	if (!lessonId) throw new Error('lessonId가 필요합니다.');
	const t = (title ?? '').trim();
	if (!t) throw new Error('title이 비어있습니다.');

	await setDoc(
		doc(db, 'lessons', lessonId),
		{
			title: t,
			updatedAt: serverTimestamp()
		},
		{ merge: true }
	);
}
