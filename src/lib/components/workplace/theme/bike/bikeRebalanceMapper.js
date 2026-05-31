// src/lib/components/workplace/theme/bike/bikeRebalanceMapper.js

export function mapBikeRebalanceRoomToSimulationState() {
	return {
		layers: {},
		sprites: {},
		camera: {}
	};
}

export function mapBikeRebalanceJsonToSimulationState(jsonText) {
	try {
		const data = JSON.parse(jsonText);

		if (!data || typeof data !== 'object' || Array.isArray(data)) {
			return {
				ok: false,
				message: 'JSON은 { }로 감싼 객체 형태여야 합니다.',
				state: {
					layers: {},
					sprites: {},
					camera: {}
				}
			};
		}

		return {
			ok: true,
			message: '자전거 재배치 데이터가 확인되었습니다.',
			state: mapBikeRebalanceRoomToSimulationState(data)
		};
	} catch (error) {
		return {
			ok: false,
			message: 'JSON 문법이 올바르지 않습니다.',
			state: {
				layers: {},
				sprites: {},
				camera: {}
			}
		};
	}
}
