import l1 from './congnitive/lesson_cognitive_1.js';
import l2 from './congnitive/lesson_cognitive_2.js';
import l3 from './congnitive/lesson_rgb_1.js';
import l4 from './congnitive/lesson_rgb_2.js';
import l5 from './congnitive/lesson_rgb_3.js';
import l6 from './congnitive/lesson_rgb_4.js';
import l7 from './congnitive/lesson_rgb_5.js';
import l8 from './congnitive/lesson_sound_1.js';
import l9 from './congnitive/lesson_sound_2.js';
import l10 from './congnitive/lesson_sound_3.js';
import l11 from './learning/lesson_find_1.js';
import l12 from './learning/lesson_find_2.js';
import l13 from './learning/lesson_sort_1.js';
import l14 from './learning/lesson_sort_2.js';
import l15 from './learning/lesson_weight_1.js';
import l16 from './learning/lesson_weight_2.js';
import l17 from './trainning/lesson_predict_1.js';
import l18 from './trainning/lesson_predict_2.js';
import l19 from './trainning/lesson_reason_1.js';
import l20 from './trainning/lesson_reason_2.js';
import l21 from './trainning/lesson_tune_1.js';
import l22 from './trainning/lesson_tune_2.js';
// 계속 추가

const allLessons = [
	l1,
	l2,
	l3,
	l4,
	l5,
	l6,
	l7,
	l8,
	l9,
	l10,
	l11,
	l12,
	l13,
	l14,
	l15,
	l16,
	l17,
	l18,
	l19,
	l20,
	l21,
	l22
];

// 1️⃣ 카테고리 그룹화
const grouped = {};

for (const lesson of allLessons) {
	if (!grouped[lesson.category]) {
		grouped[lesson.category] = {
			category: lesson.category,
			categoryOrder: lesson.categoryOrder ?? 999,
			lessons: []
		};
	}

	grouped[lesson.category].lessons.push(lesson);
}

// 2️⃣ 각 카테고리 안에서 order 정렬
for (const key in grouped) {
	grouped[key].lessons.sort((a, b) => a.order - b.order);
}

// 3️⃣ 카테고리 자체 정렬
export const categories = Object.values(grouped).sort((a, b) => a.categoryOrder - b.categoryOrder);

// 4️⃣ 평탄 배열 (필요하면)
export const posts = categories.flatMap((c) => c.lessons);

export const postsBySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));
