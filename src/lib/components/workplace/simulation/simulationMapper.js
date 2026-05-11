import { mapSpaceBaseJsonToSimulationState } from '../theme/spaceBase/spaceBaseMapper';

const mapperByThemeId = {
	spaceBase: mapSpaceBaseJsonToSimulationState
};

export function mapJsonToSimulationState(themeId, jsonText) {
	const mapper = mapperByThemeId[themeId];

	if (!mapper) {
		return {
			ok: false,
			role: null,
			message: `지원하지 않는 테마입니다: ${themeId}`,
			state: {
				layers: {}
			}
		};
	}

	return mapper(jsonText);
}

export function mergeSimulationState(prev, patch) {
	return {
		...prev,
		layers: {
			...(prev?.layers ?? {}),
			...(patch?.layers ?? {})
		}
	};
}
