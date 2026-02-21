export const ssr = false;

import { getLesson } from '$lib/firebase/lessons'; // 너가 올린 lessons.js 경로에 맞춰
import { error } from '@sveltejs/kit';

// (선택) 모듈 동적 로딩까지 기존 플레이어와 맞추려면 이거도 포함
import { classModules } from '$lib/components/classmodule/registry.js';

export async function load({ params }) {
	const lessonId = params.lessonId;
	const chapter = Number(params.step ?? '0');

	if (!lessonId) throw error(404, 'lessonId missing');
	if (Number.isNaN(chapter) || chapter < 0) throw error(400, 'invalid step');

	const post = await getLesson(lessonId);
	if (!post) throw error(404, 'lesson not found');

	// ✅ +page.svelte에서 lessonKey로 쓰기 편하게
	// (snap.data()만 리턴하므로 id가 없을 수 있음)
	post.id = lessonId;

	// ✅ module step 있으면 Svelte 컴포넌트 로더 준비
	const components = {};
	for (const step of post.steps ?? []) {
		if (step.kind !== 'module') continue;

		// registry 키 규칙이 이 형태였던 기존 코드 유지
		const key = `/src/lib/components/classmodule/${step.module}.svelte`;
		const loader = classModules[key];

		if (!loader) {
			// 모듈이 없어도 페이지가 죽지 않게 하려면 throw 대신 continue로 바꿔도 됨
			throw new Error(`Module not found: ${key}`);
		}

		components[step.module] = (await loader()).default;
	}

	// ✅ 너 플레이어(+page.svelte)가 기대하는 형태로 반환
	return {
		post,
		components,
		chapter,
		lessonKey: lessonId
	};
}
