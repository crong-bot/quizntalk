// C:\quizntalk\src\routes\player\[themeId]\+page.js

import { getCourseByThemeId } from '$lib/components/workplace/theme/courseRegistry';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const course = getCourseByThemeId(params.themeId);

	if (!course) {
		throw error(404, '존재하지 않는 목업 테마입니다.');
	}

	return {
		themeId: params.themeId
	};
}
