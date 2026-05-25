import { getJsonLearningLesson } from '$lib/components/jsonstudy/courses';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const result = getJsonLearningLesson(params.slug, params.step);

	if (!result) {
		throw error(404, '학습 단계를 찾을 수 없습니다.');
	}

	return result;
}
