import { animalRescueCourse } from './animalRescue/animalRescueCourse.js';
import { hackerTraceCourse } from './hackerTrace/hackerTraceCourse.js';
import { moonBaseCourse } from './spaceBase/spaceBaseCourse';

export const courses = [moonBaseCourse, animalRescueCourse, hackerTraceCourse];

// const courseByThemeId = {
// 	spaceBase: moonBaseCourse
// };

export function getAllCourses() {
	return courses;
}
export function getCourseByThemeId(themeId) {
	return courses.find((course) => course.themeId === themeId || course.id === themeId) ?? null;
}
