export const ssr = false;

import { classModules } from '$lib/components/classmodule/registry.js';
import { error } from '@sveltejs/kit';
import { posts } from '../../../data.js';

export async function load({ params }) {
	const post = posts.find((p) => p.slug === params.slug);
	if (!post) throw error(404, 'local lesson not found');

	const chapter = Number(params.step ?? '0'); // 너 코드에서 chapter로 쓰고 있으니 이름 맞춤
	if (Number.isNaN(chapter) || chapter < 0) throw error(400, 'invalid step');

	// ✅ 기존과 동일: module step들만 동적 import 해서 components 맵 만들기
	const components = {};
	for (const step of post.steps ?? []) {
		if (step.kind !== 'module') continue;

		// registry.js 키 규칙이 이 형태였던 거 유지
		const key = `/src/lib/components/classmodule/${step.module}.svelte`;
		const loader = classModules[key];
		if (!loader) throw new Error(`Module not found: ${key}`);

		components[step.module] = (await loader()).default;
	}

	// ✅ +page.svelte가 기대하는 형태
	return { post, components, chapter };
}
