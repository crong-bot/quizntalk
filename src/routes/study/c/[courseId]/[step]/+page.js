export const ssr = false;

import { db } from '$lib/firebase/client';
import { error } from '@sveltejs/kit';
import { doc, getDoc } from 'firebase/firestore';

import { classModules } from '$lib/components/classmodule/registry.js';
import { listLessonsByCourse } from '$lib/firebase/courses'; // ✅ 이미 너가 쓰는 함수
import { getLesson } from '$lib/firebase/lessons'; // lessonId로 레슨 가져오는 함수

export async function load({ params }) {
	const courseId = (params.courseId ?? '').trim();
	const step = Number(params.step ?? '0');

	if (!courseId) throw error(404, 'courseId missing');
	if (Number.isNaN(step) || step < 0) throw error(400, 'invalid step');

	// 1) course 정보
	const courseSnap = await getDoc(doc(db, 'courses', courseId));
	if (!courseSnap.exists()) throw error(404, 'course not found');

	const course = { id: courseSnap.id, ...courseSnap.data() };

	// 2) 목차(차시 목록) 가져오기
	// - courses.js에 이미 listLessonsByCourse(courseId) 있으니 그걸 쓰는 게 제일 현실적
	const lessons = await listLessonsByCourse(courseId); // [{id/lessonId,title,...}, ...]

	if (!Array.isArray(lessons) || lessons.length === 0) {
		// 코스는 있는데 차시가 없을 때
		return {
			mode: 'empty',
			course,
			lessons: [],
			post: null,
			components: {},
			step,
			lessonKey: ''
		};
	}

	// 3) 첫번째 레슨 결정 (정렬/저장된 order가 listLessonsByCourse에 반영된다고 가정)
	const first = lessons[0];
	const firstLessonId = first?.lessonId ?? first?.id;
	if (!firstLessonId) throw error(500, 'first lesson id missing');

	// 4) 레슨 본문 로드
	const post = await getLesson(firstLessonId);
	if (!post) throw error(404, 'lesson not found');

	post.id = firstLessonId;

	// 5) module 컴포넌트 동적 로딩 (기존 유지)
	const components = {};
	for (const s of post.steps ?? []) {
		if (s.kind !== 'module') continue;

		const key = `/src/lib/components/classmodule/${s.module}.svelte`;
		const loader = classModules[key];

		if (!loader) {
			// 페이지 터지기 싫으면 continue로 바꿔도 됨
			throw new Error(`Module not found: ${key}`);
		}
		components[s.module] = (await loader()).default;
	}

	// ✅ 반환: 플레이어 + 목차/강의정보까지 모두 사용 가능
	return {
		mode: 'course',
		course, // 강의 정보 (오른쪽 모달)
		lessons, // 목차 (Sidebar/모달)
		post, // 현재 재생할 레슨(일단 첫 레슨)
		components,
		step,
		lessonKey: firstLessonId,
		courseId
	};
}
