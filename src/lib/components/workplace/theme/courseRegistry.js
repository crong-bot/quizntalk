import { animalRescueCourse } from './animalRescue/animalRescueCourse.js';
import { bikeRebalanceCourse } from './bike/bikeRebalanceCourse.js';
import { disasterSafetyCourse } from './disasterSafety/disasterSafetyCourse.js';
import { hackerTraceCourse } from './hackerTrace/hackerTraceCourse.js';
import { marketBasketCourse } from './market/marketBasketCourse.js';
import { monsterDefenseCourse } from './monsterDefense/monsterDefenseCourse.js';
import { owlBusCourse } from './owlBus/owlBusCourse.js';
import { robotCockpitCourse } from './robotCockpit/robotCockpitCourse.js';
import { moonBaseCourse } from './spaceBase/spaceBaseCourse';
import { weatherAppCourse } from './weatherApp/weatherAppCourse.js';

export const courses = [
	moonBaseCourse,
	animalRescueCourse,
	hackerTraceCourse,
	marketBasketCourse,
	bikeRebalanceCourse,
	disasterSafetyCourse,
	owlBusCourse,
	monsterDefenseCourse,
	robotCockpitCourse,
	weatherAppCourse
];

// const courseByThemeId = {
// 	spaceBase: moonBaseCourse
// };

export function getAllCourses() {
	return courses;
}
export function getCourseByThemeId(themeId) {
	return courses.find((course) => course.themeId === themeId || course.id === themeId) ?? null;
}
