import { animalRescueCourse } from './animalRescue/animalRescueCourse.js';
import { moonBaseCourse } from './spaceBase/spaceBaseCourse';

export const courses = [moonBaseCourse, animalRescueCourse];

// const courseByThemeId = {
// 	spaceBase: moonBaseCourse
// };

export function getAllCourses() {
	return courses;
}
export function getCourseByThemeId(themeId) {
	return courses.find((course) => course.themeId === themeId || course.id === themeId) ?? null;
}
