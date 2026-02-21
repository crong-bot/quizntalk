import { classModules } from '$lib/components/classmodule/registry.js';

export async function load({ data }) {
	const { post } = data;
	const components = {};

	for (const step of post.steps) {
		if (step.kind !== 'module') continue;

		const key = `/src/lib/components/classmodule/${step.module}.svelte`;
		const loader = classModules[key];
		if (!loader) throw new Error(`Module not found: ${key}`);

		components[step.module] = (await loader()).default;
	}

	return { post, components };
}
