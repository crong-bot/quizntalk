export const ssr = false;

import { classModules } from '$lib/components/classmodule/registry.js';
import { error } from '@sveltejs/kit';

import lecture from '$lib/data/lecture_content.json';
import { postsBySlug } from '$lib/data/lessons';

function getAllCourses(lectureJson) {
	const tabs = Array.isArray(lectureJson?.tabs) ? lectureJson.tabs : [];
	const out = [];

	for (const tab of tabs) {
		const sections = Array.isArray(tab?.sections) ? tab.sections : [];
		for (const section of sections) {
			const courses = Array.isArray(section?.courses) ? section.courses : [];
			for (const c of courses) {
				out.push({
					...c,
					_tabId: tab?.id,
					_tabTitle: tab?.title,
					_sectionId: section?.id,
					_sectionTitle: section?.title
				});
			}
		}
	}
	return out;
}

export async function load({ params }) {
	const courseSlug = (params.slug ?? '').trim(); // /study/local/[slug]/[step]
	const step = Number(params.step ?? '0');

	if (!courseSlug) throw error(404, 'slug missing');
	if (Number.isNaN(step) || step < 0) throw error(400, 'invalid step');

	// ✅ tabs/sections/courses 전부 펼쳐서 찾기
	const allCourses = getAllCourses(lecture);
	const course = allCourses.find((c) => (c?.course ?? '').trim() === courseSlug);

	if (!course) throw error(404, `course not found: ${courseSlug}`);
	// ✅ 현재 코스가 속한 "같은 section"의 courses 배열 찾기
	const tabObj = (lecture?.tabs ?? []).find((t) => t?.id === course._tabId);
	const sectionObj = (tabObj?.sections ?? []).find((s) => s?.id === course._sectionId);
	const sectionCourses = Array.isArray(sectionObj?.courses) ? sectionObj.courses : [];

	// ✅ sectionCourses 안에서 현재 course index 찾기
	const courseIdx = sectionCourses.findIndex((c) => (c?.course ?? '').trim() === courseSlug);

	// ✅ prev/next course
	const prevCourse = courseIdx > 0 ? sectionCourses[courseIdx - 1] : null;
	const nextCourse =
		courseIdx >= 0 && courseIdx < sectionCourses.length - 1 ? sectionCourses[courseIdx + 1] : null;

	const lessons = Array.isArray(course.lessons) ? course.lessons : [];
	if (lessons.length === 0) {
		return {
			mode: 'empty',
			course,
			lessons: [],
			current: null,
			post: null,
			components: {},
			step,
			lessonKey: '',
			courseId: courseSlug
		};
	}

	const idx = Math.min(step, lessons.length - 1);
	const current = lessons[idx];

	const lessonKey = (current?.lessonId ?? '').trim();
	if (!lessonKey) throw error(500, 'lessonId missing');

	const post = postsBySlug[lessonKey];
	if (!post) throw error(404, `local lesson not found: ${lessonKey}`);

	const components = {};
	for (const s of post.steps ?? []) {
		if (s.kind !== 'module') continue;

		const key = `/src/lib/components/classmodule/${s.module}.svelte`;
		const loader = classModules[key];
		if (!loader) throw error(500, `Module not found: ${key}`);

		components[s.module] = (await loader()).default;
	}

	return {
		mode: 'course',
		course,
		lessons,
		current,
		post,
		components,
		step,
		lessonKey,
		courseId: courseSlug,
		prevCourse: prevCourse ? { course: prevCourse.course, title: prevCourse.title } : null,
		nextCourse: nextCourse ? { course: nextCourse.course, title: nextCourse.title } : null
	};
}
