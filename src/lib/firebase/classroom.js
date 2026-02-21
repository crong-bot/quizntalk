import { db } from '$lib/firebase/client';
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	serverTimestamp,
	setDoc
} from 'firebase/firestore';

/** 내 강의실(수강목록) 등록 */
export async function addToClassroom({ uid, lessonId }) {
	if (!uid) throw new Error('uid가 필요합니다.');
	if (!lessonId) throw new Error('lessonId가 필요합니다.');

	const lessonRef = doc(db, 'lessons', lessonId);
	const lessonSnap = await getDoc(lessonRef);
	if (!lessonSnap.exists()) throw new Error('강의를 찾을 수 없습니다.');

	const lesson = lessonSnap.data();

	// public이 아니면 owner만 직접 추가 가능(나중에 invite 코드로 확장 가능)
	if (lesson.visibility !== 'public' && lesson.ownerUid !== uid) {
		throw new Error('비공개 강의입니다. (코드 추가 기능을 붙여야 합니다)');
	}

	const enrollRef = doc(db, 'users', uid, 'enrollments', lessonId);
	await setDoc(
		enrollRef,
		{
			lessonId,
			sourceOwnerUid: lesson.ownerUid ?? null,
			addedAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		},
		{ merge: true }
	);

	return { lessonId };
}

/** 내 강의실(수강목록) 삭제 */
export async function removeFromClassroom({ uid, lessonId }) {
	if (!uid) throw new Error('uid가 필요합니다.');
	if (!lessonId) throw new Error('lessonId가 필요합니다.');
	const enrollRef = doc(db, 'users', uid, 'enrollments', lessonId);
	await deleteDoc(enrollRef);
}

/** 내 강의실 목록: enrollments + lessons 조합해서 카드용 데이터로 반환 */
export async function listClassroomLessons({ uid }) {
	if (!uid) throw new Error('uid가 필요합니다.');

	const enrollQ = query(
		collection(db, 'users', uid, 'enrollments'),
		orderBy('updatedAt', 'desc'),
		limit(100)
	);
	const enrollSnap = await getDocs(enrollQ);
	const enrollments = enrollSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

	// lesson 문서들 가져오기(간단 버전: 개별 getDoc)
	// 규모 커지면 캐시/배치 전략 따로 잡자.
	const out = [];
	for (const e of enrollments) {
		const lessonId = e.lessonId ?? e.id;
		const lessonRef = doc(db, 'lessons', lessonId);
		const lessonSnap = await getDoc(lessonRef);

		if (!lessonSnap.exists()) {
			out.push({
				lessonId,
				missing: true,
				enrollment: e
			});
			continue;
		}

		out.push({
			lessonId,
			...lessonSnap.data(),
			enrollment: e
		});
	}

	return out;
}
