import { validateAnimalRescueMissionJson } from './animalRescueValidator.js';
import { validateMonsterDefenseMissionJson } from './monsterDefenseValidator.js';
import { validateRobotCockpitMissionJson } from './robotCockpitValidator.js';
import { validateSpaceBaseMissionJson } from './spaceBaseValidator.js';
import { validateWeatherAppMissionJson } from './weatherAppValidator.js';

const validatorByThemeId = {
	spaceBase: validateSpaceBaseMissionJson,
	animalRescue: validateAnimalRescueMissionJson,
	monsterDefense: validateMonsterDefenseMissionJson,
	robotCockpit: validateRobotCockpitMissionJson,
	weatherApp: validateWeatherAppMissionJson
};

export function validateMissionJson({ jsonText, course, missionIndex, roleId }) {
	const themeId = course?.themeId;
	const validator = validatorByThemeId[themeId];

	if (!validator) {
		return {
			ok: false,
			type: 'condition',
			messages: [
				{
					type: 'error',
					text: `지원하지 않는 검증 테마입니다: ${themeId}`
				}
			]
		};
	}

	return validator({
		jsonText,
		course,
		missionIndex,
		roleId
	});
}
