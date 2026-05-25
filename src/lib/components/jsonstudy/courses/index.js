import { lesson01 } from './lesson01.js';
import { lesson02 } from './lesson02.js';
import { lesson03 } from './lesson03.js';
import { lesson04 } from './lesson04.js';
import { lesson05 } from './lesson05.js';
import { lesson06 } from './lesson06.js';
import { lesson07 } from './lesson07.js';
import { lesson08 } from './lesson08.js';
import { lesson09 } from './lesson09.js';
import { lesson10 } from './lesson10.js';

export const jsonBasicCourse = {
	slug: 'json-basic',
	title: '제이슨 첫걸음',
	subtitle: '앱 속 데이터가 어떻게 정리되는지 1단계부터 배워요.',
	category: '기초',
	level: '초5~6',
	icon: '📱',
	color: 'blue',
	lessons: [
		lesson01,
		lesson02,
		lesson03,
		lesson04,
		lesson05,
		lesson06,
		lesson07,
		lesson08,
		lesson09,
		lesson10
	]
};

export const jsonLearningCourses = [jsonBasicCourse];

export function getJsonLearningCourse(slug) {
	return jsonLearningCourses.find((course) => course.slug === slug) ?? null;
}

export function getJsonLearningLesson(slug, step) {
	const course = getJsonLearningCourse(slug);

	if (!course) {
		return null;
	}

	const stepNumber = Number(step);

	if (!Number.isInteger(stepNumber)) {
		return null;
	}

	const lessonIndex = stepNumber - 1;

	if (lessonIndex < 0 || lessonIndex >= course.lessons.length) {
		return null;
	}

	const lesson = course.lessons[lessonIndex];

	return {
		course,
		lesson,
		lessonIndex,
		stepNumber,
		totalCount: course.lessons.length
	};
}
